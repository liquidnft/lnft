import { tick } from "svelte";
import { get } from "svelte/store";
import { api, electrs } from "$lib/api";
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

//const network = networks.liquid;
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
        interval: setInterval(() => txns(get(user).address), 5000),
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
    let f = (a) => electrs.url(`/address/${a}/utxo`).get().json();
    let single = (await f(singlesig)).map((u) => ({ ...u, single: true }));
    let multi = (await f(multisig)).map((u) => ({ ...u, multi: true }));
    let utxos = [...single, ...multi];

    assets.set(
      utxos
        .map(({ asset: a }) => ({ name: assetLabel(a), asset: a }))
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter(
          (item, pos, ary) => item && (!pos || item.asset != ary[pos - 1].asset)
        )
    );

    let b = {};
    let p = {};

    utxos.map((u) => {
      if (u.status.confirmed) {
        if (b[u.asset]) b[u.asset] += u.value;
        else b[u.asset] = u.value;
      } else {
        if (p[u.asset]) p[u.asset] += u.value;
        else p[u.asset] = u.value;
      }
    });

    balances.set(b);
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

const DUST = 1000;

export const createWallet = (mnemonic, pass) => {
  try {
    if (!pass) pass = get(password);
    mnemonic = cryptojs.AES.encrypt(mnemonic, pass).toString();

    const key = keypair(mnemonic, pass);

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
  if (!mnemonic) mnemonic = get(user).mnemonic;
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

  let params = { redeem, network };

  return payments.p2sh(params);
};

export const multisig = (key) => {
  if (!key) key = keypair();

  // let { pubkey } = await api.url("/pubkey").get().json();
  let pubkey = Buffer.from(
    "02e4520146cb2536acc5431d2e786f89470aa8ed3e2c61afecfc8d1e858e01eaa8",
    "hex"
  );

  let redeem = payments.p2ms({
    m: 2,
    pubkeys: [key.pubkey, pubkey],
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

const fund = async (
  psbt,
  out,
  asset,
  amount,
  sighashType = 1,
  multisig = false
) => {
  let { address, redeem, output } = out;

  let utxos = shuffle(
    (await electrs.url(`/address/${address}/utxo`).get().json())
      .filter((o) => o.asset === asset)
      .filter((o) => o.asset !== btc || o.value > DUST)
  );

  let i = 0;
  let total = 0;

  while (total < amount) {
    if (i >= utxos.length)
      throw { message: "Insufficient funds", amount, asset, total };
    total += utxos[i].value;
    i++;
  }

  for (var j = 0; j < i; j++) {
    let prevout = utxos[j];
    let hex = await getHex(prevout.txid);

    let input = {
      hash: prevout.txid,
      index: prevout.vout,
      // witnessUtxo: tx.outs[prevout.vout],
      nonWitnessUtxo: Buffer.from(hex, "hex"),
      redeemScript: redeem.output,
      sighashType,
    };

    if (multisig) {
      input.witnessScript = redeem.redeem.output;
    }

    psbt.addInput(input);
  }

  if (total > amount) {
    psbt.addOutput({
      asset,
      nonce: Buffer.alloc(1),
      script: multisig ? singlesig().output : out.output,
      value: total - amount,
    });
  }
};

export const pay = async ({ asset, auction_end, royalty }, to, amount) => {
  amount = parseInt(amount);

  let ms = !!(royalty || auction_end);

  let swap = new Psbt()
    .addOutput({
      asset,
      nonce: Buffer.alloc(1),
      script: Address.toOutputScript(to, network),
      value: amount,
    })
    .addOutput({
      asset: btc,
      nonce: Buffer.alloc(1, 0),
      script: Buffer.alloc(0),
      value: get(fee),
    });

  let out = ms ? multisig() : singlesig();
  if (asset === btc) {
    await fund(swap, singlesig(), asset, amount + get(fee));
  } else {
    await fund(swap, out, asset, amount, 1, ms);
    await fund(swap, singlesig(), btc, get(fee));
  }

  return swap;
};

export const cancelSwap = async ({ auction_end, royalty, asset }) => {
  let ms = royalty || auction_end;
  let out = ms ? multisig() : singlesig();

  let swap = new Psbt()
    .addOutput({
      asset,
      nonce: Buffer.alloc(1),
      script: out.output,
      value: 1,
    })
    .addOutput({
      asset: btc,
      nonce: Buffer.alloc(1, 0),
      script: Buffer.alloc(0),
      value: get(fee),
    });

  await fund(swap, out, asset, 1);
  await fund(swap, singlesig(), btc, get(fee));

  return swap;
};

export const sign = (sighash = 1) => {
  let $psbt = get(psbt);

  let { privkey } = keypair();

  $psbt.data.inputs.map((_, i) => {
    try {
      $psbt = $psbt
        .signInput(i, ECPair.fromPrivateKey(privkey), [sighash])
        .finalizeInput(i);
    } catch (e) {
      // console.log(e.message);
    }
  });

  psbt.set($psbt);
  return $psbt;
};

export const broadcast = async () => {
  let tx = get(psbt).extractTransaction();
  let hex = tx.toHex();

  return electrs.url("/tx").body(hex).post().text();
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
  let swap = Psbt.fromBase64(list_price_tx);
  let out = singlesig();
  let script = (royalty ? multisig() : singlesig()).output;
  let total = list_price;

  swap
    .addOutput({
      asset,
      nonce: Buffer.alloc(1),
      script,
      value: 1,
    })
    .addOutput({
      asset: btc,
      nonce: Buffer.alloc(1, 0),
      script: Buffer.alloc(0),
      value: get(fee),
    });

  if (royalty && artist_id !== owner_id) {
    let value = Math.round((total * royalty) / 100);
    total += value;

    swap.addOutput({
      asset: asking_asset,
      value,
      nonce: Buffer.alloc(1),
      script: Address.toOutputScript(address, network),
    });
  }

  if (asking_asset === btc) total += get(fee);
  else await fund(swap, out, btc, get(fee));
  await fund(swap, out, asking_asset, total);

  return swap;
};

export const createIssuance = async (artwork, domain, tx) => {
  let out = singlesig();

  let p = new Psbt()
    // fee
    .addOutput({
      asset: btc,
      nonce: Buffer.alloc(1, 0),
      script: Buffer.alloc(0),
      value: get(fee),
    })
    // op_return
    .addOutput({
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

    let input = {
      index,
      hash: tx.getId(),
      nonWitnessUtxo: Buffer.from(tx.toHex(), "hex"),
      redeemScript: out.redeem.output,
    };

    p.addInput(input);

    p.addOutput({
      asset: btc,
      nonce: Buffer.alloc(1),
      script: out.output,
      value: parseVal(tx.outs[index].value) - get(fee),
    });
  } else await fund(p, out, btc, get(fee));

  let ticker = (artwork.title.split(" ").length > 2
    ? artwork.title
        .split(" ")
        .map((w) => w[0])
        .join("")
    : artwork.title
  )
    .substr(0, 4)
    .toUpperCase();

  let contract = {
    entity: { domain },
    issuer_pubkey: keypair().pubkey.toString("hex"),
    name: artwork.title,
    hash: artwork.filename,
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

  psbt.set(p);
  return contract;
};

export const signOver = async ({ asset }) => {
  let p = new Psbt();
  await fund(p, multisig(), asset, 1, noneAnyoneCanPay, true);
  psbt.set(p);
  return sign(noneAnyoneCanPay);
};

export const createRelease = async ({ asset, owner }, tx) => {
  let p = new Psbt()
    .addOutput({
      asset,
      nonce: Buffer.alloc(1),
      script: Address.toOutputScript(owner.address, network),
      value: 1,
    })
    .addOutput({
      asset: btc,
      nonce: Buffer.alloc(1, 0),
      script: Buffer.alloc(0),
      value: get(fee),
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

  psbt.set(p);

  return sign();
};

export const createSwap = async (
  { asset, asking_asset, auction_end, royalty },
  amount
) => {
  let swap = new Psbt().addOutput({
    asset: asking_asset,
    nonce: Buffer.alloc(1),
    script: singlesig().output,
    value: amount,
  });

  let ms = royalty || auction_end;

  await fund(
    swap,
    ms ? multisig() : singlesig(),
    asset,
    1,
    singleAnyoneCanPay,
    ms
  );

  return swap;
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
  let out = singlesig();
  let ms = !!(auction_end || royalty);

  let swap = new Psbt()
    .addOutput({
      asset,
      nonce: Buffer.alloc(1),
      script: Address.toOutputScript(artwork.owner.address, network),
      value: amount,
    })
    .addOutput({
      asset: btc,
      nonce: Buffer.alloc(1, 0),
      script: Buffer.alloc(0),
      value: get(fee),
    });

  let total = parseInt(amount);
  let pubkey = fromBase58(artwork.owner.pubkey, network).publicKey;
  let ownerOut;

  if (ms) {
    if (royalty && artist_id !== owner_id) {
      let value = Math.round((total * royalty) / 100);
      total += value;

      swap.addOutput({
        asset,
        value,
        nonce: Buffer.alloc(1),
        script: Address.toOutputScript(artwork.artist.address, network),
      });
    }

    swap.addOutput({
      asset: artwork.asset,
      nonce: Buffer.alloc(1),
      script: out.output,
      value: 1,
    });

    ownerOut = multisig({ pubkey });
  } else {
    ownerOut = singlesig({ pubkey });

    swap.addOutput({
      asset: artwork.asset,
      nonce: Buffer.alloc(1),
      script: out.output,
      value: 1,
    });
  }

  try {
    await fund(swap, ownerOut, artwork.asset, 1, 1, ms);
  } catch (e) {
    throw new Error(
      "Unable to construct offer, the asset could not be found in the owner's wallet"
    );
  }

  if (asset === btc) {
    total += get(fee);
  } else {
    await fund(swap, out, btc, get(fee));
  }

  await fund(swap, out, asset, total);

  return swap;
};

export const sendToMultisig = async (artwork) => {
  let out = singlesig();
  let { output: script } = multisig();
  let { asset } = artwork;
  let value = 1;

  let p = new Psbt()
    .addOutput({
      asset,
      nonce: Buffer.alloc(1),
      script,
      value,
    })
    .addOutput({
      asset: btc,
      nonce: Buffer.alloc(1, 0),
      script: Buffer.alloc(0),
      value: get(fee),
    });

  await fund(p, out, asset, value);
  await fund(p, out, btc, get(fee));

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
