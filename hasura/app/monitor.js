const { api, hasura, electrs, registry } = require("./api");

const query = `
  query transactions {
    transactions(where: {
      confirmed: {_eq: false},
      type: {_in: ["purchase", "creation", "royalty", "accept"] },
    }) {
      id
      hash
      bid {
        id
      } 
    }
  }
`;

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
      type
      asset
      contract
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

const acceptOffer = {
  query: `mutation accept_offer($id: uuid!, $owner_id: uuid!, $amount: Int!, $psbt: String!, $asset: String!, $hash: String!) {
    insert_transactions_one(object: {
      artwork_id: $id,
      asset: $asset,
      type: "accept",
      amount: $amount,
      hash: $hash,
      psbt: $psbt,
    }) {
      id,
      artwork_id
    } 
  }`,
};

setInterval(
  async () =>
    hasura
      .post({ query })
      .json(({ data: { transactions } }) =>
        transactions.map((tx) =>
          electrs
            .url(`/tx/${tx.hash}/status`)
            .get()
            .json(
              ({ confirmed }) =>
                confirmed ||
                hasura
                  .post({ query: setConfirmed, variables: { id: tx.id } })
                  .json(
                    async ({
                      data: { update_transactions_by_pk: transaction },
                    }) => {
                      let owner_id;

                      if (transaction.type === "accept")
                        owner_id = transaction.bid.user_id;

                      if (transaction.type === "purchase")
                        owner_id = transaction.user_id;

                      try {
                        if (transaction.type === "creation")
                          await registerAsset(transaction);
                      } catch (e) {
                        console.log(e.message);
                      }

                      hasura.post({
                        query: updateArtwork,
                        variables: {
                          id: transaction.artwork_id,
                          owner_id,
                        },
                      });
                    }
                  )
                  .catch(console.log)
            )
            .catch(console.log)
        )
      )
      .catch(console.log),
  2000
);

proofs = {};
const registerAsset = async ({ asset: asset_id, contract, user }) => {
  proofs[asset_id] = true;

  // Wait 30s for propagation
  await new Promise((r) => setTimeout(r, 30000));

  const { data } = await registry
    .post({
      asset_id,
      contract: JSON.parse(contract),
    })
    .json();
};

app.get("/proof/liquid-asset-proof-:asset", (req, res) => {
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
    transactions(where: { user_id: {_eq: "${user.id}"}})  {
      hash
    }
  }`;

  let {
    data: { transactions },
  } = await hasura.post({ query }).json();

  let unseen = txns.filter(
    (tx) => !transactions.find((t) => tx.txid === t.hash)
  );
  for (let i = 0; i < unseen.length; i++) {
    let { txid, vin, vout, status } = unseen[i];
    let total = {};
    for (let j = 0; j < vin.length; j++) {
      let { txid, vout } = vin[j];
      let tx = await electrs
        .url(`/tx/${txid}`)
        .get()
        .json()
        .catch(() => {});
      let { asset, value, scriptpubkey_address: a } = tx.vout[vout];
      if ([user.address, user.multisig].includes(a))
        total[asset] ? (total[asset] -= value) : (total[asset] = -value);
    }
    vout.map(({ asset, value, scriptpubkey_address: a }) => {
      if ([user.address, user.multisig].includes(a))
        total[asset] ? (total[asset] += value) : (total[asset] = value);
    });

    let assets = Object.keys(total);
    for (i = 0; i < assets.length; i++) {
      let asset = assets[i];
      let type = total[asset] < 0 ? "withdrawal" : "deposit";
      query = `mutation {
        insert_transactions_one(object: {
          asset: "${asset}",
          type: "${type}",
          amount: ${total[asset]},
          hash: "${txid}",
        }) {
          id
        }
      }`;

      let insert = await api(req.headers).post({ query }).json();
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

  res.send({});
});
