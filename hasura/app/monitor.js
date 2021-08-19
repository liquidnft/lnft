const { api, hasura, electrs, registry } = require("./api");
const { formatISO } = require("date-fns");
const reverse = require("buffer-reverse");
const fs = require("fs");

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

    await hasura
      .post({
        query: insertTransaction,
        variables: {
          transaction: {
            type: "receipt",
            user_id: transaction.artwork.owner_id,
            artwork_id,
            hash,
            psbt,
            amount: -1,
            asset,
          },
        },
      })
      .json();
  }

  hasura.post({
    query: updateArtwork,
    variables: {
      id: transaction.artwork_id,
      owner_id,
    },
  });
};

const confirmTransactions = (result) => {
  let { data: { transactions } } = result;
  transactions.map((tx) => {
    electrs
      .url(`/tx/${tx.hash}/status`)
      .get()
      .json(
        ({ confirmed }) =>
          confirmed &&
          hasura
            .post({ query: setConfirmed, variables: { id: tx.id } })
            .json(transferOwnership)
      );
  });
};

const query = `
  query transactions {
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
  }
`;

setInterval(
  () => hasura.post({ query }).json(confirmTransactions).catch(console.log),
  2000
);

app.post("/asset/register", async (req, res) => {
  let { asset } = req.body;

  let proofs = {};
  try {
    proofs = require("./proofs.json");
  } catch (e) {}

  proofs[asset] = true;
  fs.writeFileSync("proofs.json", JSON.stringify(proofs));

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
    let r = await hasura
      .post({ query, variables: { asset } })
      .json()
      .catch(console.log);

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
      transactions(where: { user_id: {_eq: "${user.id}"}}) {
        hash
        asset
      }
    }`;

    let { transactions } = (await hasura.post({ query }).json()).data;

    for (let i = 0; i < txns.length; i++) {
      let { txid, vin, vout, status } = txns[i];
      let total = {};

      for (let j = 0; j < vin.length; j++) {
        let { txid, vout } = vin[j];
        let tx = await electrs.url(`/tx/${txid}`).get().json();
        let { asset, value, scriptpubkey_address: a } = tx.vout[vout];

        if ([user.address, user.multisig].includes(a)) {
          if (asset) {
            if (transactions.find((t) => t.hash === txid && t.asset === asset))
              continue;

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

        let insert = await hasura.post({ query }).json().catch(console.log);

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
        type: {_in: ["deposit", "withdrawal", "creation", "release", "purchase", "receipt"]}
      }) {
        id
        hash
        amount
        created_at
        asset
      }
    }`;

    res.send((await hasura.post({ query }).json()).data);
  } catch (e) {
    console.log(e);
    res.code(500).send(e.message);
  }
});
