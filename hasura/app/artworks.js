const { api, electrs, hasura } = require("./api");
const { broadcast } = require("./wallet");
const { Psbt } = require("liquidjs-lib");
const { compareAsc, parseISO } = require("date-fns");

const crypto = require("crypto");
const wretch = require("wretch");
const { HASURA_URL, SERVER_URL } = process.env;

app.post("/cancel", auth, async (req, res) => {
  let { id } = req.body;

  let query = `query { 
    transactions_by_pk(id: "${id}") {
      user_id
    }
  }`;

  let r = await hasura.post({ query }).json().catch(console.error);

  query = `query {
      currentuser {
        id
      } 
    }`;

  let { data } = await api(req.headers).post({ query }).json();
  let user = data.currentuser[0];

  if (r.errors) return res.code(500).send("could not fetch transaction");
  if (r.data.transactions_by_pk.user_id !== user.id)
    return res.code(401).send();

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

  r = await hasura
    .post({ query, variables: { id } })
    .json()
    .catch(console.error);

  res.send(r);
});

app.post("/transfer", auth, async (req, res) => {
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

    r = await hasura
      .post({ query, variables: { transaction } })
      .json()
      .catch(console.error);
  }

  res.send({});
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

    let result = await hasura
      .post({
        query,
        variables: { id: req.body.id },
      })
      .json();

    if (result.data) {
      let { asset, owner } = result.data.update_artworks_by_pk;
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

      result = await hasura
        .post({
          query,
          variables: { id: req.body.id, held },
        })
        .json();

      if (result.errors) console.log("problem updating held status", result);
    }

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

    r = await hasura
      .post({
        query,
        variables: { id, owner_id: user.id },
      })
      .json()
      .catch(console.error);

    res.send(r);
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

    let { data, errors } = await hasura.post({ query }).json();
    if (errors) throw new Error(errors[0].message);
    let {
      auction_end,
      auction_start,
      owner,
      title,
      bid,
      slug,
    } = data.artworks[0];

    if (
      bid &&
      transaction.type === "bid" &&
      auction_end &&
      compareAsc(parseISO(auction_end), new Date()) > 0
    ) {
      throw new Error(`Minimum bid is ${(bid.amount + 1000) / 100000000}`);
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
    console.log(e);
    res.code(500).send(e.message);
  }
});

app.post("/release/update", auth, async (req, res) => {
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

  r = await hasura
    .post({ query, variables: req.body })
    .json()
    .catch(console.error);

  res.send(r);
});

app.post("/tx/update", auth, async (req, res) => {
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

  r = await hasura
    .post({ query, variables: req.body })
    .json()
    .catch(console.error);

  res.send(r);
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
