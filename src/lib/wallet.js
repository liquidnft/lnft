import bs58 from "bs58";
import { tick } from "svelte";
import { get } from "svelte/store";
import { api, electrs, hasura } from "$lib/api";
import { retry } from "wretch-middlewares";
import { mnemonicToSeedSync } from "bip39";
import { fromSeed } from "bip32";
import { fromBase58 } from "bip32";
import {
  address as Address,
  confidential,
  ECPair,
  Psbt,
  payments,
  networks,
  Transaction,
} from "@asoltys/liquidjs-lib";
import { Buffer } from "buffer";
import reverse from "buffer-reverse";
import {
  assets,
  balances,
  fee,
  pending,
  password,
  snack,
  user,
  poll,
  psbt,
  sighash,
  transactions,
  token,
} from "$lib/store";
import cryptojs from "crypto-js";
import { btc, assetLabel } from "$lib/utils";
import { requirePassword } from "$lib/auth";
import { getActiveBids } from "$queries/transactions";

const DUST = 1000;

const SERVER_PUBKEY = Buffer.from(
  "03c3722bb4260f8c449fc8f266a58348d99410a26096fba84fb15c1d66d868f87b",
  "hex"
);
const network = networks.regtest;

const singleAnyoneCanPay =
  Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY;
const noneAnyoneCanPay =
  Transaction.SIGHASH_NONE | Transaction.SIGHASH_ANYONECANPAY;

export const parseVal = (v) => parseInt(v.slice(1).toString("hex"), 16);
export const parseAsset = (v) => reverse(v.slice(1)).toString("hex");

export const getTransactions = () => {
  if (!get(poll).find((p) => p.name === "txns"))
    poll.set([
      ...get(poll),
      {
        name: "txns",
        interval: setInterval(() => txns(get(user).address), 10000),
      },
    ]);

  let txns = async (address) => {
    transactions.set(await electrs.url(`/address/${address}/txs`).get().json());
  };

  return txns(get(user).address);
};

export const getBalances = () => {
  if (!get(poll).find((p) => p.name === "balances"))
    poll.set([
      ...get(poll),
      {
        name: "balances",
        interval: setInterval(
          () => getUtxos(get(user).address, get(user).multisig),
          5000
        ),
      },
    ]);

  let getUtxos = async (singlesig, multisig) => {
    await requirePassword();
    let locked = await getLocked();
    let f = (a) => electrs.url(`/address/${a}/utxo`).get().json();
    let single = (await f(singlesig)).map((u) => ({ ...u, single: true }));
    let multi = (await f(multisig)).map((u) => ({ ...u, multi: true }));
    let utxos = [...single, ...multi].filter((u) => !locked.includes(u.txid));

    assets.set(
      [...utxos, { asset: btc }]
        .map(({ asset: a }) => ({ name: assetLabel(a), asset: a }))
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter((a, i, r) => a && (!i || a.asset != r[i - 1].asset))
    );

    let b = {};
    let p = {};

    utxos.map((u) => {
      if (u.asset === btc && u.value < DUST) return;
      if (u.status.confirmed) {
        if (b[u.asset]) b[u.asset] += parseInt(u.value);
        else b[u.asset] = u.value;
      } else {
        if (p[u.asset]) p[u.asset] += parseInt(u.value);
        else p[u.asset] = u.value;
      }
    });

    balances.set(JSON.parse(JSON.stringify(b)));
    pending.set(p);
  };

  return getUtxos(get(user).address, get(user).multisig);
};

const getHex = async (txid) => {
  return electrs.url(`/tx/${txid}/hex`).get().text();
};

export const getTx = async (txid) => {
  return Transaction.fromHex(await getHex(txid));
};

export const createWallet = (mnemonic, pass) => {
  try {
    if (!pass) pass = get(password);
    if (!mnemonic) mnemonic = getMnemonic();

    mnemonic = cryptojs.AES.encrypt(mnemonic, pass).toString();

    const key = keypair(mnemonic, pass);
    let { pubkey, seed } = key;

    return {
      address: singlesig(key).address,
      pubkey: key.base58,
      mnemonic,
      multisig: multisig(key).address,
    };
  } catch (e) {
    console.log(e);
    throw new Error("Failed to create wallet from mnemonic");
  }
};

export const getMnemonic = (mnemonic, pass) => {
  if (!mnemonic && get(user)) mnemonic = get(user).mnemonic;
  if (!pass) pass = get(password);

  mnemonic = cryptojs.AES.decrypt(mnemonic, pass).toString(cryptojs.enc.Utf8);
  if (!mnemonic) throw new Error("Unable to decrypt mnmemonic");
  return mnemonic;
};

export const keypair = (mnemonic, pass) => {
  mnemonic = getMnemonic(mnemonic, pass);

  try {
    let seed = mnemonicToSeedSync(mnemonic);
    let key = fromSeed(seed, network).derivePath("m/84'/0'/0'/0/0");
    let { publicKey: pubkey, privateKey: privkey } = key;
    let base58 = key.neutered().toBase58();

    return { pubkey, privkey, seed, base58 };
  } catch (e) {
    throw new Error("Failed to generated keys with mnemonic");
  }
};

export const singlesig = (key) => {
  if (!key) key = keypair();
  let { pubkey, seed } = key;

  let redeem = payments.p2wpkh({
    pubkey,
    network,
  });

  return payments.p2sh({
    redeem,
    network,
  });
};

export const multisig = (key) => {
  if (!key) key = keypair();

  let redeem = payments.p2ms({
    m: 2,
    pubkeys: [key.pubkey, SERVER_PUBKEY].sort((a, b) =>
      a.toString("hex").localeCompare(b.toString("hex"))
    ),
    network,
  });

  return payments.p2sh({
    redeem: payments.p2wsh({
      redeem,
      network,
    }),
  });
};

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const getLocked = async (asset = btc) => {
  let locked = [];
  if (asset === btc) {
    try {
      let res = await hasura
        .auth(`Bearer ${get(token)}`)
        .post({
          query: getActiveBids(get(user).id),
        })
        .json();

      res.data.activebids.map((t) => {
        let p = Psbt.fromBase64(t.psbt);
        locked.push(
          ...p.data.globalMap.unsignedTx.tx.ins.map((i) =>
            reverse(i.hash).toString("hex")
          )
        );
      });
    } catch (e) {
      console.log(e);
    }
  }

  return locked;
};

const fund = async (
  p,
  out,
  asset,
  amount,
  sighashType = 1,
  multisig = false
) => {
  let { address, redeem, output } = out;

  let utxos = await electrs.url(`/address/${address}/utxo`).get().json();
  let locked = await getLocked(asset);

  utxos = shuffle(
    utxos.filter(
      (o) =>
        o.asset === asset &&
        (o.asset !== btc || o.value > DUST) &&
        !locked.includes(o.txid)
    )
  );

  let i = 0;
  let total = 0;

  while (total < amount) {
    if (i >= utxos.length) {
      throw { message: "Insufficient funds", amount, asset, total };
    }
    total += utxos[i].value;
    i++;
  }

  for (var j = 0; j < i; j++) {
    let prevout = utxos[j];
    let hex = await getHex(prevout.txid);
    let tx = Transaction.fromHex(hex);

    let input = {
      hash: prevout.txid,
      index: prevout.vout,
      redeemScript: redeem.output,
      nonWitnessUtxo: Buffer.from(hex, "hex"),
      sighashType,
    };

    if (multisig) {
      input.witnessScript = redeem.redeem.output;
    }

    p.addInput(input);
  }

  if (total > amount) {
    if (total - amount > DUST || asset !== btc) {
      let changeIndex = p.data.outputs.length;

      p.addOutput({
        asset,
        nonce: Buffer.alloc(1),
        script: multisig ? singlesig().output : out.output,
        value: total - amount,
      });
    } else bumpFee(total - amount);
  }
};

const emptyNonce = Buffer.from("0x00", "hex");

const addFee = (p) =>
  p.addOutput({
    asset: btc,
    nonce: Buffer.alloc(1, 0),
    script: Buffer.alloc(0),
    value: get(fee),
  });

const bumpFee = (v) => fee.set(get(fee) + v);

export const pay = async (artwork, to, amount) => {
  let asset = btc;
  let auction_end, royalty;

  if (artwork) ({ asset, auction_end, royalty } = artwork);

  let script;
  try {
    script = Address.toOutputScript(to, network);
  } catch (e) {
    throw new Error("Unrecognized address");
  }

  amount = parseInt(amount);

  let ms = !!(royalty || auction_end);

  let p = new Psbt().addOutput({
    asset,
    nonce: Buffer.alloc(1),
    script,
    value: amount,
  });

  let out = ms ? multisig() : singlesig();
  if (asset === btc) {
    await fund(p, singlesig(), asset, amount + get(fee));
  } else {
    await fund(p, out, asset, amount, 1, ms);
    await fund(p, singlesig(), btc, get(fee));
  }

  addFee(p);

  return p;
};

export const cancelSwap = async ({ auction_end, royalty, asset }) => {
  let ms = royalty || auction_end;
  let out = ms ? multisig() : singlesig();

  let p = new Psbt().addOutput({
    asset,
    nonce: Buffer.alloc(1),
    script: out.output,
    value: 1,
  });

  await fund(p, out, asset, 1);
  await fund(p, singlesig(), btc, get(fee));

  addFee(p);

  return p;
};

export const sign = (sighash = 1) => {
  let p = get(psbt);

  let { privkey } = keypair();

  p.data.inputs.map((_, i) => {
    try {
      p = p
        .signInput(i, ECPair.fromPrivateKey(privkey), [sighash])
        .finalizeInput(i);
    } catch (e) {
      // console.log("failed to sign", e.message, i, sighash);
    }
  });

  psbt.set(p);
  return p;
};

export const broadcast = (disableRetries = false) => {
  let tx = get(psbt).extractTransaction();
  let hex = tx.toHex();
  let middlewares = [
    retry({
      delayTimer: 6000,
      maxAttempts: 3,
    }),
  ];

  if (disableRetries) middlewares = [];

  return electrs.url("/tx").middlewares(middlewares).body(hex).post().text();
};

export const signAndBroadcast = async () => {
  await tick();
  await sign();
  await tick();
  await broadcast();
  return get(psbt);
};

export const executeSwap = async (artwork) => {
  let {
    list_price,
    list_price_tx,
    asset,
    asking_asset,
    royalty,
    artist: { address },
    artist_id,
    owner_id,
  } = artwork;
  let p = Psbt.fromBase64(list_price_tx);
  let out = singlesig();
  let script = (royalty ? multisig() : singlesig()).output;
  let total = list_price;

  fee.set(100);

  p.addOutput({
    asset,
    nonce: Buffer.alloc(1),
    script,
    value: 1,
  });

  if (royalty && artist_id !== owner_id) {
    let value = Math.round((total * royalty) / 100);
    total += value;

    p.addOutput({
      asset: asking_asset,
      value,
      nonce: Buffer.alloc(1),
      script: Address.toOutputScript(address, network),
    });
  }

  if (asking_asset === btc) total += get(fee);
  else await fund(p, out, btc, get(fee));
  await fund(p, out, asking_asset, total);

  addFee(p);

  return p;
};

export const createIssuance = async (
  { filename: file, title: name, ticker },
  domain,
  tx
) => {
  let out = singlesig();
  fee.set(50);

  let p = new Psbt().addOutput({
    asset: btc,
    nonce: Buffer.alloc(1),
    script: payments.embed({ data: [Buffer.alloc(1)] }).output,
    value: 0,
  });

  if (tx) {
    let index = tx.outs.findIndex(
      (o) =>
        parseAsset(o.asset) === btc &&
        o.script.toString("hex") === out.output.toString("hex")
    );

    if (index > -1) {
      let input = {
        index,
        hash: tx.getId(),
        nonWitnessUtxo: Buffer.from(tx.toHex(), "hex"),
        redeemScript: out.redeem.output,
      };

      p.addInput(input);

      let value = parseVal(tx.outs[index].value) - get(fee);

      if (value > DUST)
        p.addOutput({
          asset: btc,
          nonce: Buffer.alloc(1),
          script: out.output,
          value,
        });
      else bumpFee(value);
    }
  } else {
    await fund(p, out, btc, get(fee), 1, false, false);
  }

  let contract = {
    entity: { domain },
    file,
    issuer_pubkey: keypair().pubkey.toString("hex"),
    name,
    precision: 0,
    ticker,
    version: 0,
  };

  p.addIssuance({
    assetAmount: 1,
    assetAddress: out.address,
    tokenAmount: 0,
    precision: 0,
    net: network,
    contract,
  });

  addFee(p);

  psbt.set(p);

  return contract;
};

export const signOver = async ({ asset }, tx) => {
  let p = new Psbt();

  if (!tx) {
    let utxos = await electrs
      .url(`/address/${multisig().address}/utxo`)
      .get()
      .json();
    let prevout = utxos.find((o) => o.asset === asset);
    let hex = await getHex(prevout.txid);
    tx = Transaction.fromHex(hex);
  }

  let index = tx.outs.findIndex((o) => parseAsset(o.asset) === asset);

  p.addInput({
    index,
    hash: tx.getId(),
    nonWitnessUtxo: Buffer.from(tx.toHex(), "hex"),
    redeemScript: multisig().redeem.output,
    witnessScript: multisig().redeem.redeem.output,
    sighashType: noneAnyoneCanPay,
  });

  psbt.set(p);
  sign(noneAnyoneCanPay);
  return tx;
};

export const createRelease = async ({ asset, owner }, tx) => {
  let p = new Psbt().addOutput({
    asset,
    nonce: Buffer.alloc(1),
    script: Address.toOutputScript(owner.address, network),
    value: 1,
  });

  let index = tx.outs.findIndex(
    (o) =>
      parseAsset(o.asset) === btc &&
      parseVal(o.value) >= get(fee) &&
      o.script.toString("hex") === singlesig().output.toString("hex")
  );

  if (index > -1) {
    p.addInput({
      index,
      hash: tx.getId(),
      nonWitnessUtxo: Buffer.from(tx.toHex(), "hex"),
      redeemScript: singlesig().redeem.output,
    });

    if (parseVal(tx.outs[index].value) > get(fee)) {
      p.addOutput({
        asset: btc,
        nonce: Buffer.alloc(1),
        script: singlesig().output,
        value: parseVal(tx.outs[index].value) - get(fee),
      });
    }
  } else {
    await fund(p, singlesig(), btc, get(fee), 1, false);
  }

  index = tx.outs.findIndex((o) => parseAsset(o.asset) === asset);

  p.addInput({
    index,
    hash: tx.getId(),
    nonWitnessUtxo: Buffer.from(tx.toHex(), "hex"),
    redeemScript: multisig().redeem.output,
    witnessScript: multisig().redeem.redeem.output,
  });

  addFee(p);

  psbt.set(p);

  return sign();
};

export const createSwap = async (
  { asset, asking_asset, auction_end, royalty },
  amount,
  tx
) => {
  if (asking_asset === btc && amount < DUST)
    throw new Error(
      `Minimum asking price is ${(DUST / 100000000).toFixed(8)} L-BTC`
    );

  let p = new Psbt().addOutput({
    asset: asking_asset,
    nonce: Buffer.alloc(1),
    script: singlesig().output,
    value: amount,
  });

  let ms = !!(royalty || auction_end);

  if (tx) {
    let index = tx.outs.findIndex((o) => parseAsset(o.asset) === asset);

    p.addInput({
      index,
      hash: tx.getId(),
      nonWitnessUtxo: Buffer.from(tx.toHex(), "hex"),
      redeemScript: multisig().redeem.output,
      witnessScript: multisig().redeem.redeem.output,
      sighashType: singleAnyoneCanPay,
    });
  } else {
    await fund(
      p,
      ms ? multisig() : singlesig(),
      asset,
      1,
      singleAnyoneCanPay,
      ms
    );
  }

  return p;
};

export const createOffer = async (artwork, amount) => {
  amount = parseInt(amount);

  let {
    asking_asset: asset,
    artist_id,
    owner_id,
    auction_end,
    royalty,
  } = artwork;

  if (asset === btc && amount < DUST)
    throw new Error(`Minimum bid is ${(DUST / 100000000).toFixed(8)} L-BTC`);

  let ms = !!(auction_end || royalty);
  let out = singlesig();

  let p = new Psbt().addOutput({
    asset,
    nonce: Buffer.alloc(1),
    script: Address.toOutputScript(artwork.owner.address, network),
    value: amount,
  });

  let total = parseInt(amount);
  let pubkey = fromBase58(artwork.owner.pubkey, network).publicKey;
  let ownerOut;

  if (ms) {
    if (royalty && artist_id !== owner_id) {
      let value = Math.round((total * royalty) / 100);
      total += value;

      p.addOutput({
        asset,
        value,
        nonce: Buffer.alloc(1),
        script: Address.toOutputScript(artwork.artist.address, network),
      });
    }

    p.addOutput({
      asset: artwork.asset,
      nonce: Buffer.alloc(1),
      script: royalty ? multisig().output : singlesig().output,
      value: 1,
    });

    ownerOut = multisig({ pubkey });
  } else {
    ownerOut = singlesig({ pubkey });

    p.addOutput({
      asset: artwork.asset,
      nonce: Buffer.alloc(1),
      script: out.output,
      value: 1,
    });
  }

  try {
    await fund(p, ownerOut, artwork.asset, 1, 1, ms);
  } catch (e) {
    throw new Error(
      "Unable to construct offer, the asset could not be found in the owner's wallet"
    );
  }

  if (asset === btc) {
    total += get(fee);
  } else {
    await fund(p, out, btc, get(fee));
  }

  await fund(p, out, asset, total);

  addFee(p);

  return p;
};

export const sendToMultisig = async (artwork) => {
  let out = singlesig();
  let { output: script } = multisig();
  let { asset } = artwork;
  let value = 1;

  let p = new Psbt().addOutput({
    asset,
    nonce: Buffer.alloc(1),
    script,
    value,
  });

  await fund(p, out, asset, value);
  await fund(p, out, btc, get(fee));
  addFee(p);

  psbt.set(p);
  return p;
};

export const requestSignature = async (psbt) => {
  let { base64 } = await api
    .url("/sign")
    .headers({ authorization: `Bearer ${get(token)}` })
    .post({ psbt: psbt.toBase64() })
    .json();
  return Psbt.fromBase64(base64);
};

export const getAddress = (out) =>
  Address.fromOutputScript(out.script, network);
