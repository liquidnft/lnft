const { api, ipfs, q, electrs, registry } = require("./api");
const { formatISO, compareAsc, parseISO, subMinutes } = require("date-fns");
const reverse = require("buffer-reverse");
const fs = require("fs");
const { networks, Psbt } = require("liquidjs-lib");

const {
  cancelBid,
  cancelListing,
  createTransaction,
  getActiveBids,
  getActiveListings,
  getAvatars,
  getChainTxs,
  getContract,
  getCurrentUser,
  getLastTransaction,
  getUnconfirmed,
  setConfirmed,
  setTransactionTime,
  updateArtwork,
  updateUser,
} = require("./queries");

const network = process.env.LIQUID_ELECTRS_URL.includes("blockstream")
  ? networks.liquid
  : networks.regtest;

const btc = network.assetHash;
const txcache = {};

const updateAvatars = async () => {
  fs.readdir("/export", async (err, files) => {
    try {
      let { users } = await q(getAvatars);

      users.map((user) => {
        let f = files.find((f) => f.startsWith(user.avatar_url));
        if (f && f !== user.avatar_url) {
          user.avatar_url = f;
          console.log("updating user", user.avatar_url);

          q(updateUser, { user, id: user.id }).catch(console.log);
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

  return q(updateArtwork, { id: transaction.artwork_id, owner_id });
};

const isSpent = async ({ ins }, artwork_id) => {
  try {
    let { transactions } = await q(getLastTransaction, { artwork_id });

    if (
      compareAsc(
        parseISO(transactions[0].created_at),
        subMinutes(new Date(), 2)
      ) > 0
    )
      return false;

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
  } catch (e) {
    console.log("problem checking spent status", e);
    return false;
  }
};

const checkBids = async () => {
  try {
    let { activebids } = await q(getActiveBids);

    for (let i = 0; i < activebids.length; i++) {
      let tx = activebids[i];

      let p = Psbt.fromBase64(tx.psbt);
      try {
        if (await isSpent(p.data.globalMap.unsignedTx.tx, tx.artwork_id))
          await q(cancelBid, { id: tx.id });
      } catch (e) {
        // keep going
      }
    }
  } catch (e) {
    console.log("problem checking bids", e);
  }

  setTimeout(checkBids, 5000);
};
setTimeout(checkBids, 2000);

const checkListings = async () => {
  try {
    let { activelistings } = await q(getActiveListings);
    for (let i = 0; i < activelistings.length; i++) {
      let tx = activelistings[i];
      let p = Psbt.fromBase64(tx.psbt);
      try {
        if (await isSpent(p.data.globalMap.unsignedTx.tx, tx.artwork_id))
          await q(cancelListing, { id: tx.id, artwork_id: tx.artwork_id });
      } catch (e) {
        // keep going;
      }
    }
  } catch (e) {
    console.log("problem checking listings", e);
  }

  setTimeout(checkListings, 5000);
};
// setTimeout(checkListings, 4000);

const checkTransactions = async () => {
  try {
    let { transactions } = await q(getUnconfirmed);

    for (let i = 0; i < transactions.length; i++) {
      let tx = transactions[i];
      let { confirmed } = await electrs
        .url(`/tx/${tx.hash}/status`)
        .get()
        .json();

      if (confirmed) {
        await q(setConfirmed, { id: tx.id });
        await transferOwnership();
      }
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

  try {
    let { transactions } = await q(getContract, asset);
    let { contract } = transactions[0];

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

let getUser = async (headers) => {
  let { data, errors } = await api(headers).post({ query: getCurrentUser }).json();
  if (errors) throw new Error(errors[0].message);
  return data.currentuser[0];
};

let seen = (user, address, txid, asset, transactions) =>
  [user.address, user.multisig].includes(address) &&
  asset &&
  !transactions.find((t) => t.hash === txid && t.asset === asset);

app.get("/transactions", auth, async (req, res) => {
  try {
    let user = await getUser(req.headers);
    let get = (addr) => electrs.url(`/address/${addr}/txs`).get().json();
    let txns = [...(await get(user.address)), ...(await get(user.multisig))];

    let { transactions } = await q(getChainTxs, { id: user.id });

    for (let i = 0; i < txns.length; i++) {
      let { txid, vin, vout, status } = txns[i];

      let total = {};

      for (let j = 0; j < vin.length; j++) {
        let { txid: prev, vout } = vin[j];

        let tx =
          txcache[prev] || (await electrs.url(`/tx/${prev}`).get().json());
        txcache[prev] = tx;

        let { asset, value, scriptpubkey_address: a } = tx.vout[vout];

        if (seen(user, a, txid, asset, transactions))
          total[asset]
            ? (total[asset] -= parseInt(value))
            : (total[asset] = parseInt(-value));
      }

      for (let k = 0; k < vout.length; k++) {
        let { asset, value, scriptpubkey_address: a } = vout[k];

        if (seen(user, a, txid, asset, transactions))
          total[asset]
            ? (total[asset] += parseInt(value))
            : (total[asset] = parseInt(value));
      }

      let assets = Object.keys(total);

      for (let l = 0; l < assets.length; l++) {
        let asset = assets[l];
        if (total[asset] === 0) continue;
        let type = total[asset] < 0 ? "withdrawal" : "deposit";
        let transaction = {
          user_id: user.id,
          asset: asset,
          type: type,
          amount: total[asset],
          hash: txid,
          confirmed: true,
        };

        try {
          let {
            insert_transactions_one: { id },
          } = await q(createTransaction, { transaction });

          if (status.block_time) {
            await q(setTransactionTime, {
              id,
              created_at: formatISO(new Date(1000 * status.block_time)),
            });
          }
        } catch (e) {
          console.log(e);
          continue;
        }
      }
    }

    res.send(await q(getChainTxs, { id: user.id }));
  } catch (e) {
    console.log(e);
    res.code(500).send(e.message);
  }
});

let getTransactions = async (address, last) => {
  let curr = await electrs.url(`/address/${address}/txs/chain`).get().json();
  let txns = [...curr];
  while (curr.length === 25 && !curr.find((tx) => tx.txid === last)) {
    curr = await electrs
      .url(`/address/${address}/txs/chain/${curr[24].txid}`)
      .get()
      .json();
    txns.push(...curr);
  }

  return txns;
};

app.get("/balance", auth, async (req, res) => {
  let { asset = btc } = req.query;
  let { address, last_seen_tx } = await getUser(req.headers);
  let txns = await getTransactions(address, last_seen_tx);

  let outs = [];
  txns.map(({ txid, vout }) => {
    vout.map(
      ({ value, asset, scriptpubkey_address }, vout) =>
        scriptpubkey_address === address &&
        outs.push({ txid, vout, value, asset })
    );
  });

  txns.map((tx) => {
    tx.vin.map((input) => {
      let i = outs.findIndex(
        (o) => o.txid === input.txid && o.vout === input.vout
      );
      if (i > -1) outs.splice(i, 1);
    });
  });

  res.send(
    outs.filter((o) => o.asset === asset).reduce((a, b) => a + b.value, 0)
  );
});
