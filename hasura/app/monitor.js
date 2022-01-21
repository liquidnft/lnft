const { api, ipfs, q, electrs, registry } = require("./api");
const { formatISO, compareAsc, parseISO, subMinutes } = require("date-fns");
const reverse = require("buffer-reverse");
const fs = require("fs");
const { networks, Psbt } = require("liquidjs-lib");
const sleep = (n) => new Promise((r) => setTimeout(r, n));

const {
  cancelBid,
  cancelListing,
  createTransaction,
  createUtxo,
  deleteUtxo,
  getActiveBids,
  getActiveListings,
  getAvatars,
  getContract,
  getCurrentUser,
  getLastTransaction,
  getLastTransactionsForAddress,
  getTransactions,
  getUserByAddress,
  getUnconfirmed,
  getUtxos,
  setConfirmed,
  setOwner,
  setTransactionTime,
  updateUser,
} = require("./queries");

const network = process.env.LIQUID_ELECTRS_URL.includes("blockstream")
  ? networks.liquid
  : networks.regtest;

const btc = network.assetHash;
const txcache = {};
const hexcache = {};

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

const transferOwnership = async (transaction) => {};

const isSpent = async ({ ins }, artwork_id) => {
  try {
    let { transactions } = await q(getLastTransaction, { artwork_id });

    if (
      !transactions.length ||
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

      await sleep(1000);
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
      let { block_time, confirmed } = await electrs
        .url(`/tx/${tx.hash}/status`)
        .get()
        .json();

      if (confirmed) {
        let {
          update_transactions_by_pk: { artwork_id, type, bid },
        } = await q(setConfirmed, {
          id: tx.id,
        });

        if (["deposit", "withdrawal"].includes(type))
          await q(setTransactionTime, {
            id: tx.id,
            created_at: formatISO(new Date(1000 * block_time)),
          });

        if (type === "accept")
          await q(setOwner, { id: artwork_id, owner_id: bid.user_id });
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
  let { data, errors } = await api(headers)
    .post({ query: getCurrentUser })
    .json();
  if (errors) throw new Error(errors[0].message);
  return data.currentuser[0];
};

app.get("/transactions", auth, async (req, res) => {
  try {
    let { id, address, multisig } = await getUser(req.headers);

    await updateTransactions(address, id);
    await updateTransactions(multisig, id);

    res.send(await q(getTransactions, { id }));
  } catch (e) {
    console.log(e);
    res.code(500).send(e.message);
  }
});

let getTxns = async (address, latest) => {
  let curr = await electrs
    .url(`/address/${address}/txs`)
    .get()
    .notFound(console.log)
    .json();

  let txns = [...curr];

  while (curr.length === 25 && !curr.find((tx) => latest.includes(tx.txid))) {
    curr = await electrs
      .url(`/address/${address}/txs/chain/${curr[24].txid}`)
      .get()
      .json();
    txns.push(...curr);
  }

  let index = txns.reduce((a, b, i) => (latest.includes(b.txid) ? a : i), 0);
  ++index >= 0 && txns.splice(index);
  return txns;
};

let updateTransactions = async (address, user_id) => {
  let { transactions } = await q(getLastTransactionsForAddress, { address });
  let txns = (
    await getTxns(
      address,
      transactions.map((tx) => tx.hash)
    )
  ).reverse();
  if (txns.length)
    console.log(`updating ${txns.length} transactions for ${address}`);

  for (let i = 0; i < txns.length; i++) {
    let { txid, vin, vout, status } = txns[i];

    let hex;
    try {
      hex =
        hexcache[txid] || (await electrs.url(`/tx/${txid}/hex`).get().text());
      hexcache[txid] = hex;
    } catch (e) {
      await sleep(3000);
      hex =
        hexcache[txid] || (await electrs.url(`/tx/${txid}/hex`).get().text());
      hexcache[txid] = hex;
    }

    let total = {};

    for (let j = 0; j < vin.length; j++) {
      let { txid: prev, vout } = vin[j];

      let tx = txcache[prev] || (await electrs.url(`/tx/${prev}`).get().json());
      txcache[prev] = tx;

      let { asset, value, scriptpubkey_address: a } = tx.vout[vout];
      if (address === a) total[asset] = (total[asset] || 0) - parseInt(value);
    }

    for (let k = 0; k < vout.length; k++) {
      let { asset, value, scriptpubkey_address: a } = vout[k];
      if (address === a) total[asset] = (total[asset] || 0) + parseInt(value);
    }

    let assets = Object.keys(total);

    for (let l = 0; l < assets.length; l++) {
      let asset = assets[l];
      let type = total[asset] < 0 ? "withdrawal" : "deposit";

      if (
        total[asset] === 0 ||
        transactions.find(
          (tx) =>
            tx.user_id === user_id && tx.hash === txid && tx.asset === asset && tx.type === type
        )
      )
        continue;

      let transaction = {
        address,
        user_id,
        asset,
        type,
        amount: total[asset],
        hash: txid,
        confirmed: status.confirmed,
        hex,
        json: JSON.stringify(txns[i]),
      };

      if (status.block_time)
        transaction.created_at = formatISO(new Date(1000 * status.block_time));

      try {
        let {
          insert_transactions_one: { id },
        } = await q(createTransaction, { transaction });
        transactions.push(transaction);
      } catch (e) {
        console.log(e);
        continue;
      }
    }
  }

  if (txns.length) console.log("done");

  return txns;
};

let scanUtxos = async (address) => {
  let { users } = await q(getUserByAddress, { address });
  if (!users.length) return [];
  let { id } = users[0];

  await updateTransactions(address, id);

  let { transactions } = await q(getTransactions, { id });

  let { utxos } = await q(getUtxos, { address });

  let outs = utxos.map(
    ({
      id,
      transaction_id,
      tx: { hash, sequence, confirmed },
      vout,
      value,
      asset,
    }) => ({
      id,
      txid: hash,
      vout,
      value,
      asset,
      sequence,
      confirmed,
      transaction_id,
    })
  );

  transactions = transactions.filter(
    (tx) => !outs.length || tx.sequence > outs[0].sequence
  );

  transactions.map(async ({ id, hash, asset: txAsset, json, confirmed }) => {
    if (!json) json = await electrs.url(`/tx/${hash}`).get().json();
    else json = JSON.parse(json);

    json.vout.map(
      ({ value, asset, scriptpubkey_address }, vout) =>
        scriptpubkey_address === address &&
        asset === txAsset &&
        !outs.find(
          (o) => hash === o.txid && vout === o.vout && o.asset === asset
        ) &&
        outs.push({
          transaction_id: id,
          txid: hash,
          vout,
          value,
          asset,
          confirmed,
        })
    );
  });

  transactions.map(async ({ hash, json }) => {
    if (!json) json = await electrs.url(`/tx/${hash}`).get().json();
    else json = JSON.parse(json);

    json.vin.map(({ txid, vout }) => {
      let spent = [];

      outs = outs.filter((o) =>
        o.txid === txid && o.vout === vout ? spent.push(o) && false : true
      );

      spent.map(
        ({ id }) => id && q(deleteUtxo, { id }).then().catch(console.log)
      );
    });
  });

  let unseen = outs.filter(
    (o) => !utxos.find((u) => u.tx.hash === o.txid && u.vout === o.vout)
  );

  for (let i = 0; i < unseen.length; i++) {
    let { vout, asset, value, transaction_id } = unseen[i];

    try {
      await q(createUtxo, {
        utxo: {
          vout,
          asset,
          value,
          transaction_id,
          address,
          user_id: id,
        },
      });
    } catch (e) {
      continue;
    }
  }

  return outs;
};

app.get("/balance", auth, async (req, res) => {
  try {
    let { address, multisig, id, last_seen_tx } = await getUser(req.headers);
    let outs = [...(await scanUtxos(address)), ...(await scanUtxos(multisig))];
    let pending = [];

    outs = outs.filter((o) => (o.confirmed ? true : pending.push(o) && false));

    let sum = (a, b) => ({ ...a, [b.asset]: (a[b.asset] || 0) + b.value });
    res.send({
      confirmed: outs.reduce(sum, {}),
      pending: pending.reduce(sum, {}),
    });
  } catch (e) {
    console.log("problem getting balance", e);
    res.code(500).send(e.message);
  }
});

app.get("/address/:address/utxo", async (req, res) => {
  try {
    let { address } = req.params;
    await scanUtxos(address);
    let { utxos } = await q(getUtxos, { address });
    res.send(
      utxos.map(({ vout, tx: { hash, hex, confirmed }, asset, value }) => ({
        vout,
        txid: hash,
        hex,
        asset,
        value,
        confirmed,
      }))
    );
  } catch (e) {
    console.log("problem getting utxos", e);
    res.code(500).send(e.message);
  }
});
