const { api, electrs, q } = require("./api");
const { broadcast } = require("./wallet");
const { Psbt } = require("liquidjs-lib");
const { compareAsc, parseISO } = require("date-fns");

const crypto = require("crypto");
const wretch = require("wretch");
const { SERVER_URL } = process.env;

app.post("/cancel", auth, async (req, res) => {
  try {
    let { id } = req.body;

    let query = `query { 
    transactions_by_pk(id: "${id}") {
      user_id
    }
  }`;

    let { transactions_by_pk } = await q(query);

    query = `query {
      currentuser {
        id
      } 
    }`;

    let { data } = await api(req.headers).post({ query }).json();
    let user = data.currentuser[0];

    if (transactions_by_pk.user_id !== user.id) return res.code(401).send();

    query = `mutation ($id: uuid!) {
    update_transactions_by_pk(
      pk_columns: { id: $id }, 
      _set: { 
        type: "cancelled_bid"
      }
    ) {
     id
    }
  }`;

    let { update_transactions_by_pk } = await q(query, { id });

    res.send({ data: { update_transactions_by_pk } });
  } catch (e) {
    console.log("problem cancelling bid", e);
    res.code(500).send(e.message);
  }
});

app.post("/transfer", auth, async (req, res) => {
  try {
    let { address, transaction } = req.body;
    await new Promise((r) => setTimeout(r, 2000));

    let utxos = await electrs.url(`/address/${address}/utxo`).get().json();

    if (utxos.find((tx) => tx.asset === transaction.asset)) {
      let query = `mutation create_transaction($transaction: transactions_insert_input!) {
      insert_transactions_one(object: $transaction) {
        id,
        artwork_id
      } 
    }`;

      transaction.user_id = req.body.id;
      transaction.type = "receipt";

      await q(query, { transaction });
    }

    res.send({});
  } catch (e) {
    console.log("problem transferring artwork", e);
    res.code(500).send(e.message);
  }
});

app.post("/viewed", async (req, res) => {
  try {
    let query = `mutation ($id: uuid!) {
      update_artworks_by_pk(pk_columns: { id: $id }, _inc: { views: 1 }) {
        id
        owner {
          address
          multisig
        } 
        asset
      }
    }`;

    let { update_artworks_by_pk } = await q(query, { id: req.body.id });
    let { asset, owner } = update_artworks_by_pk;
    let { address, multisig } = owner;

    let find = async (a) =>
      (await electrs.url(`/address/${a}/utxo`).get().json()).find(
        (tx) => tx.asset === asset
      );

    let held = null;
    if (await find(address)) held = "single";
    if (await find(multisig)) held = "multisig";

    query = `mutation ($id: uuid!, $held: String!) {
      update_artworks_by_pk(pk_columns: { id: $id }, _set: { held: $held }) {
        id
        owner {
          address
          multisig
        } 
        asset
      }
    }`;

    await q(query, { id: req.body.id, held });

    res.send({});
  } catch (e) {
    console.log(e);
    res.code(500).send(e.message);
  }
});

app.post("/claim", auth, async (req, res) => {
  try {
    let {
      artwork: { asset, id },
    } = req.body;
    let query = `query {
      currentuser {
        id
        address
        multisig
      } 
    }`;

    let { data } = await api(req.headers).post({ query }).json();
    let user = data.currentuser[0];

    let { address, multisig } = user;

    let utxos = [
      ...(await electrs.url(`/address/${address}/utxo`).get().json()),
      ...(await electrs.url(`/address/${multisig}/utxo`).get().json()),
    ];

    let held = !!utxos.find((tx) => tx.asset === asset);

    query = `mutation($id: uuid!, $owner_id: uuid!) {
      update_artworks_by_pk(
        pk_columns: { id: $id },
        _set: { 
          owner_id: $owner_id,
        }
      ) {
        id
      }
    }`;

    res.send(await q(query, { id, owner_id: user.id }));
  } catch (e) {
    console.log(e);
    res.code(500).send(e.message);
  }
});

app.post("/transaction", auth, async (req, res) => {
  try {
    const { transaction } = req.body;

    let query = `query {
      artworks(where: { id: { _eq: "${transaction.artwork_id}" }}) {
        auction_start
        auction_end
        bid_increment
        owner {
          display_name
        } 
        title
        slug
        bid {
          amount
          user {
            id
            display_name
          } 
        } 
      }
    }`;

    let { artworks } = await q(query);
    let {
      bid_increment,
      auction_end,
      auction_start,
      owner,
      title,
      bid,
      slug,
    } = artworks[0];

    if (
      bid &&
      transaction.type === "bid" &&
      transaction.amount < bid.amount + bid_increment &&
      auction_end &&
      compareAsc(parseISO(auction_end), new Date()) > 0
    ) {
      throw new Error(
        `Minimum bid is ${((bid.amount + bid_increment) / 100000000).toFixed(
          8
        )}`
      );
    }

    let locals = {
      outbid: false,
      title,
      url: `${SERVER_URL}/a/${slug}`,
    };

    try {
      await mail.send({
        template: "notify-bid",
        locals,
        message: {
          to: owner.display_name,
        },
      });

      if (bid && bid.user) {
        locals.outbid = true;

        await mail.send({
          template: "notify-bid",
          locals,
          message: {
            to: bid.user.display_name,
          },
        });
      }
    } catch (err) {
      console.error("Unable to send email");
      console.error(err);
    }

    query = `mutation create_transaction($transaction: transactions_insert_input!) {
      insert_transactions_one(object: $transaction) {
        id,
        artwork_id
      } 
    }`;

    ({ data, errors } = await api(req.headers)
      .post({ query, variables: { transaction } })
      .json());

    if (errors) throw new Error(errors[0].message);

    res.send(data.insert_transactions_one);
  } catch (e) {
    console.log("problem creating transaction", e);
    res.code(500).send(e.message);
  }
});

app.post("/release/update", auth, async (req, res) => {
  try {
    const query = `mutation($id: uuid!, $psbt: String!) {
    update_artworks_by_pk(
      pk_columns: { id: $id },
      _set: { 
        auction_release_tx: $psbt,
      }
    ) {
      id
    }
  }`;

    res.send(await q(query, req.body));
  } catch (e) {
    console.log("problem releasing from auction", e);
    res.code(500).send(e.message);
  }
});

app.post("/tx/update", auth, async (req, res) => {
  try {
    const query = `mutation update_transaction($id: uuid!, $psbt: String!) {
    update_transactions_by_pk(
      pk_columns: { id: $id },
      _set: { 
        psbt: $psbt,
      }
    ) {
      id
    }
  }`;

    res.send(await q(query, req.body));
  } catch (e) {
    console.log("problem updating transaction", e);
    res.code(500).send(e.message);
  }
});

app.post("/accept", auth, async (req, res) => {
  let query = `mutation update_artwork($id: uuid!, $owner_id: uuid!, $amount: Int!, $psbt: String!, $asset: String!, $hash: String!, $bid_id: uuid) {
    update_artworks_by_pk(
      pk_columns: { id: $id }, 
      _set: { 
        owner_id: $owner_id,
      }
    ) {
      id
    }
    insert_transactions_one(object: {
      artwork_id: $id,
      asset: $asset,
      type: "accept",
      amount: $amount,
      hash: $hash,
      psbt: $psbt,
      bid_id: $bid_id,
    }) {
      id,
      artwork_id
    } 
  }`;

  try {
    await broadcast(Psbt.fromBase64(req.body.psbt));
    let { data } = await api(req.headers)
      .post({ query, variables: req.body })
      .json();
    res.send(data);
  } catch (e) {
    console.log(e);
    res.code(500).send(e.message);
  }
});
