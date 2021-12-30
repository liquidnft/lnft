const { api, ipfs, hasura, electrs, registry } = require("./api");
const { formatISO, compareAsc, parseISO, subMinutes } = require("date-fns");
const reverse = require("buffer-reverse");
const fs = require("fs");
const { Psbt } = require("liquidjs-lib");

const txcache = {};

const updateAvatars = async () => {
  fs.readdir("/export", async (err, files) => {
    try {
      let {
        data: { users },
      } = await hasura
        .post({
          query: `query { users { id, avatar_url }}`,
        })
        .json();

      let query = `mutation update_user($user: users_set_input!, $id: uuid!) {
      update_users_by_pk(pk_columns: { id: $id }, _set: $user) {
        id
      }
    }`;

      users.map((user) => {
        let f = files.find((f) => f.startsWith(user.avatar_url));
        if (f && f !== user.avatar_url) {
          user.avatar_url = f;
          console.log("updating user", user.avatar_url);

          hasura
            .post({
              query,
              variables: { user, id: user.id },
            })
            .json(console.log)
            .catch(console.log);
        }
      });
    } catch (e) {
      console.log(e);
    }
  });
};

app.post("/updateAvatars", async (req, res) => {
  if (req.headers["x-hasura-admin"] !== process.env.HASURA_SECRET)
    return res.code(401).send("unauthorized");

  try {
    await updateAvatars();
    res.send({ ok: true });
  } catch (e) {
    console.log(e);
  }
});

const setConfirmed = `
  mutation setConfirmed($id: uuid!) {
    update_transactions_by_pk(
      pk_columns: { id: $id }, 
      _set: { 
        confirmed: true
      }
    ) {
      id
      user_id
      artwork_id
      hash
      psbt
      type
      asset
      contract
      artwork {
        owner_id
        editions
        asset
      }
      user {
        username
      } 
      bid {
        id
        user_id
      } 
    }
  }
`;

const updateArtwork = `
  mutation updateArtwork($id: uuid!, $owner_id: uuid!) {
    update_artworks_by_pk(
      pk_columns: { id: $id }, 
      _set: { 
        owner_id: $owner_id,
      }
    ) {
      id
    }
  }
`;

const insertTransaction = `mutation ($transaction: transactions_insert_input!) {
  insert_transactions_one(object: $transaction) {
    id,
    artwork_id
  } 
}`;

const transferOwnership = async ({
  data: { update_transactions_by_pk: transaction },
}) => {
  let owner_id;

  if (transaction.type === "accept") owner_id = transaction.bid.user_id;

  if (transaction.type === "purchase") {
    owner_id = transaction.user_id;

    let {
      artwork_id,
      hash,
      psbt,
      artwork: { asset },
    } = transaction;
  }

  hasura.post({
    query: updateArtwork,
    variables: {
      id: transaction.artwork_id,
      owner_id,
    },
  });
};

const isSpent = async ({ ins }, artwork_id) => {
  let query = `query($artwork_id: uuid!) { 
    transactions(
      where: { artwork_id: { _eq: $artwork_id }},
      order_by: { created_at: desc }, 
      limit: 1
    ) {
      created_at
    }
  }`;

  let result;
  try {
    result = await hasura.post({ query, variables: { artwork_id } }).json();
  } catch (e) {
    return false;
  }

  if (
    result.errors ||
    compareAsc(
      parseISO(result.data.transactions[0].created_at),
      subMinutes(new Date(), 2)
    ) > 0
  )
    return console.log("skipping", artwork_id);

  for (let i = 0; i < ins.length; i++) {
    let { index, hash } = ins[i];
    let txid = reverse(hash).toString("hex");

    let { spent } = await electrs
      .url(`/tx/${txid}/outspend/${index}`)
      .get()
      .json();

    if (spent) return true;
  }

  return false;
};

const checkBids = async () => {
  try {
    let result = await hasura
      .post({
        query: `query {
        activebids(where: { type: { _eq: "bid" }}) {
          id
          artwork_id
          psbt
        }
      }`,
      })
      .json()
      .catch(console.log);

    if (!result || !result.data)
      return console.log("problem checking bids", result);

    let query = `mutation ($id: uuid!) {
    update_transactions_by_pk(
      pk_columns: { id: $id }, 
      _set: { 
        type: "cancelled_bid"
      }
    ) {
     id
    }
  }`;

    let {
      data: { activebids },
    } = result;

    for (let i = 0; i < activebids.length; i++) {
      let tx = activebids[i];

      let p = Psbt.fromBase64(tx.psbt);
      let variables = { id: tx.id };
      if (await isSpent(p.data.globalMap.unsignedTx.tx, tx.artwork_id))
        hasura
          .post({ query, variables })
          .json(() => console.log("cancelled bid", tx.id))
          .catch(console.log);
    }
  } catch (e) {
    console.log("problem checking bids", e);
  }

  setTimeout(checkBids, 5000);
};
setTimeout(checkBids, 2000);

const checkListings = async () => {
  try {
    let result = await hasura
      .post({
        query: `query {
        activelistings {
          id
          artwork_id
          psbt
        }
      }`,
      })
      .json();

    if (!result || !result.data)
      return console.log("problem checking listings", result);

    let query = `mutation ($id: uuid!, $artwork_id: uuid!) {
    update_artworks_by_pk(
      pk_columns: { id: $artwork_id }, 
      _set: { 
        list_price: null,
        list_price_tx: null
      }
    ) {
     id
    }
    update_transactions_by_pk(
      pk_columns: { id: $id }, 
      _set: { 
        type: "cancelled_listing"
      }
    ) {
     id
    }
  }`;

    let {
      data: { activelistings },
    } = result;

    for (let i = 0; i < activelistings.length; i++) {
      let tx = activelistings[i];
      let p = Psbt.fromBase64(tx.psbt);
      let variables = { id: tx.id, artwork_id: tx.artwork_id };
      if (await isSpent(p.data.globalMap.unsignedTx.tx, tx.artwork_id))
        await hasura.post({ query, variables }).json();
    }
  } catch (e) {
    console.log(e);
  }

  setTimeout(checkListings, 5000);
};
// setTimeout(checkListings, 4000);

const checkTransactions = async () => {
  try {
    let { data, errors } = await hasura
      .post({
        query: `query {
          transactions(where: {
            confirmed: {_eq: false},
            type: {_in: ["purchase", "creation", "royalty", "accept", "release", "auction", "cancel"] },
          }) {
            id
            hash
            bid {
              id
            } 
          }
        }`,
      })
      .json();

    if (errors) throw new Error(errors[0].message);

    for (let i = 0; i < data.transactions.length; i++) {
      let tx = data.transactions[i];
      await electrs
        .url(`/tx/${tx.hash}/status`)
        .get()
        .json(
          ({ confirmed }) =>
            confirmed &&
            hasura
              .post({ query: setConfirmed, variables: { id: tx.id } })
              .json(transferOwnership)
        );
    }
  } catch (e) {
    console.log(e);
  }

  setTimeout(checkTransactions, 5000);
};

setTimeout(checkTransactions, 8000);

app.post("/asset/register", async (req, res) => {
  let { asset } = req.body;

  let proofs = {};
  try {
    proofs = require("/export/proofs.json");
  } catch (e) {}

  proofs[asset] = true;
  fs.writeFileSync("/export/proofs.json", JSON.stringify(proofs));

  let query = `query transactions($asset: String!) {
    transactions(where: {
      _and: [{
          artwork: {
            asset: { _eq: $asset }
          }
        },
        {
          type: {
            _eq: "creation"
          }
        }
      ]
    }) {
      contract
    } 
  }`;

  try {
    let r = await hasura.post({ query, variables: { asset } }).json();

    if (!r.data) throw new Error();

    let { contract } = r.data.transactions[0];

    r = await registry
      .post({
        asset_id: asset,
        contract: JSON.parse(contract),
      })
      .json();

    res.send(r);
  } catch (e) {
    res.code(500).send(`Asset registration failed ${e.message}`);
  }
});

app.get("/proof/liquid-asset-proof-:asset", (req, res) => {
  let proofs = {};
  try {
    proofs = JSON.parse(fs.readFileSync("/export/proofs.json"));
  } catch (e) {
    console.log(e);
  }

  let {
    headers: { host },
    params: { asset },
  } = req;

  host = host.replace(/:.*/, "");
  if (proofs[asset])
    res.send(
      `Authorize linking the domain name ${host} to the Liquid asset ${asset}`
    );
  else res.code(500).send("Unrecognized asset");
});

app.get("/transactions", auth, async (req, res) => {
  try {
    let query = `query {
      currentuser {
        id
        address
        multisig
      } 
    }`;

    let { data } = await api(req.headers).post({ query }).json();
    let user = data.currentuser[0];

    let get = (addr) => electrs.url(`/address/${addr}/txs`).get().json();
    let txns = [...(await get(user.address)), ...(await get(user.multisig))];

    query = `query {
      transactions(where: { user_id: {_eq: "${user.id}"}, type: { _in: ["withdrawal", "deposit"] }} ) {
        id
        hash
        asset
        type
      }
    }`;

    let result = await hasura.post({ query }).json();
    let { transactions } = result.data;

    for (let i = 0; i < txns.length; i++) {
      let { txid, vin, vout, status } = txns[i];

      let total = {};

      for (let j = 0; j < vin.length; j++) {
        let { txid: prev, vout } = vin[j];

        let tx = txcache[prev] || (await electrs.url(`/tx/${prev}`).get().json());
        txcache[prev] = tx;

        let { asset, value, scriptpubkey_address: a } = tx.vout[vout];

        if ([user.address, user.multisig].includes(a)) {
          if (asset) {
            let t = transactions.find(
              (t) => t.hash === txid && t.asset === asset
            );
            if (t) {
              continue;
            }

            total[asset]
              ? (total[asset] -= parseInt(value))
              : (total[asset] = parseInt(-value));
          }
        }
      }

      for (let k = 0; k < vout.length; k++) {
        let { asset, value, scriptpubkey_address: a } = vout[k];

        if ([user.address, user.multisig].includes(a)) {
          if (transactions.find((t) => t.hash === txid && t.asset === asset))
            continue;

          if (asset) {
            total[asset]
              ? (total[asset] += parseInt(value))
              : (total[asset] = parseInt(value));
          }
        }
      }

      let assets = Object.keys(total);

      for (let l = 0; l < assets.length; l++) {
        let asset = assets[l];
        if (total[asset] === 0) continue;
        let type = total[asset] < 0 ? "withdrawal" : "deposit";
        query = `mutation {
          insert_transactions_one(object: {
            user_id: "${user.id}",
            asset: "${asset}",
            type: "${type}",
            amount: ${total[asset]},
            hash: "${txid}",
            confirmed: true,
          }) {
            id
          }
        }`;

        let insert = await hasura.post({ query }).json();

        if (!insert.data) {
          continue;
        }

        if (status.block_time) {
          query = `mutation {
            update_transactions_by_pk(
              pk_columns: { id: "${insert.data.insert_transactions_one.id}" }, 
              _set: { created_at: "${formatISO(
                new Date(1000 * status.block_time)
              )}" }
            ) {
              id
            }
          }`;

          await hasura.post({ query }).json();
        }
      }
    }

    query = `query {
      transactions(order_by: {created_at: desc}, where: {
        user_id: {_eq: "${user.id}"}, 
        type: {_in: ["deposit", "withdrawal"]}
      }) {
        id
        hash
        amount
        created_at
        asset
        type
      }
    }`;

    res.send((await hasura.post({ query }).json()).data);
  } catch (e) {
    console.log(e);
    res.code(500).send(e.message);
  }
});
