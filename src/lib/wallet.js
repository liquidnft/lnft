import { get } from "svelte/store";
import { amp, electrs } from "$lib/api";
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
import { password, snack, user } from "$lib/store";
import cryptojs from "crypto-js";
import { btc } from "$lib/utils";
import { fromSeed as slip77 } from "slip77";

const signingKey = Buffer.from(
  "03c3722bb4260f8c449fc8f266a58348d99410a26096fba84fb15c1d66d868f87b",
  "hex"
);
const network = networks.regtest;
const singleAnyoneCanPay =
  Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY;

export const parseVal = (v) => parseInt(v.slice(1).toString("hex"), 16);
export const parseAsset = (v) => reverse(v.slice(1)).toString("hex");

const getHex = async (txid) => {
  return electrs.url(`/tx/${txid}/hex`).get().text();
};

export const getTx = async (txid) => {
  return Transaction.fromHex(await getHex(txid));
};

const DUST = 1000;

export const getMnemonic = (mnemonic, pass) => {
  if (!mnemonic) mnemonic = get(user).mnemonic;
  if (!pass) pass = get(password);

  mnemonic = cryptojs.AES.decrypt(mnemonic, pass).toString(cryptojs.enc.Utf8);
  if (!mnemonic) throw new Error("Unable to decrypt mnmemonic");
  return mnemonic;
};

export const keypair = (mnemonic, pass) => {
  mnemonic = getMnemonic(mnemonic, pass);
  let seed = mnemonicToSeedSync(mnemonic);
  let key = fromSeed(seed, network).derivePath("m/84'/0'/0'/0/0");
  let { publicKey: pubkey, privateKey: privkey } = key;
  let base58 = key.neutered().toBase58();

  return { pubkey, privkey, seed, base58 };
};

export const unblind = (hex, vout) => {
  return;
  let { pubkey, seed } = keypair();

  let redeem = payments.p2wpkh({
    pubkey,
    network,
  });

  let blindingKey = slip77(seed).derive(redeem.output);
  let output = Transaction.fromHex(hex).outs[vout];
  let unblinded = confidential.unblindOutput(
    output.nonce,
    blindingKey.privateKey,
    output.rangeProof,
    output.value,
    output.asset,
    output.script
  );
  return unblinded;
};

export const payment = (key, blind = false) => {
  if (!key) key = keypair();
  let { pubkey, seed } = key;

  let redeem = payments.p2wpkh({
    pubkey,
    network,
  });

  let params = { redeem, network };

  if (blind) {
    params.blindkey = slip77(seed).derive(redeem.output).publicKey;
  }

  return payments.p2sh(params);
};

export const multisig = (key) => {
  if (!key) key = keypair();

  let redeem = payments.p2ms({
    m: 2,
    pubkeys: [key.pubkey, signingKey],
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
    if (i >= utxos.length) throw new Error("Insufficient funds", total, amount);
    total += utxos[i].value;
    i++;
  }

  for (var j = 0; j < i; j++) {
    let prevout = utxos[j];
    let tx = Transaction.fromHex(await getHex(prevout.txid));

    let input = {
      hash: prevout.txid,
      index: prevout.vout,
      witnessUtxo: tx.outs[prevout.vout],
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
      script: output,
      value: total - amount,
    });
  }
};

export const pay = async (asset, to, amount, fee) => {
  amount = parseInt(amount);
  fee = parseInt(fee);

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
      value: fee,
    });

  let out = payment();
  if (asset === btc) {
    await fund(swap, out, asset, amount + fee);
  } else {
    await fund(swap, out, asset, amount);
    await fund(swap, out, btc, fee);
  }

  return swap;
};

export const cancelSwap = async ({ royalty, asset }, fee) => {
  let out = royalty ? multisig() : payment();

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
      value: fee,
    });

  await fund(swap, out, asset, 1);
  await fund(swap, payment(), btc, fee);

  return swap;
};

export const sign = (psbt, sighash = 1) => {
  let { privkey } = keypair();

  psbt.data.inputs.map((_, i) => {
    try {
      psbt = psbt
        .signInput(i, ECPair.fromPrivateKey(privkey), [sighash])
        .finalizeInput(i);
    } catch (e) {}
  });

  return psbt;
};

export const broadcast = async (psbt) => {
  let tx = psbt.extractTransaction();
  let hex = tx.toHex();

  return electrs.url("/tx").body(hex).post().text();
};

export const executeSwap = async (
  { editions, list_price, list_price_tx, asset, asking_asset, royalty },
  fee
) => {
  let swap = Psbt.fromBase64(list_price_tx);
  let out = payment();
  let script = (royalty ? multisig() : payment()).output;
  let total = list_price;

  if (asking_asset === btc) total += fee;
  else await fund(swap, out, btc, fee);
  await fund(swap, out, asking_asset, total);

  swap
    .addOutput({
      asset,
      nonce: Buffer.alloc(1),
      script,
      value: editions,
    })
    .addOutput({
      asset: btc,
      nonce: Buffer.alloc(1, 0),
      script: Buffer.alloc(0),
      value: fee,
    });

  return swap;
};

export const createIssuance = async (editions, fee) => {
  let out = payment();

  let swap = new Psbt()
    // fee
    .addOutput({
      asset: btc,
      nonce: Buffer.alloc(1, 0),
      script: Buffer.alloc(0),
      value: fee,
    })
    // op_return
    .addOutput({
      asset: btc,
      nonce: Buffer.alloc(1),
      script: payments.embed({ data: [Buffer.alloc(1)] }).output,
      value: 0,
    });

  await fund(swap, out, btc, fee);

  swap.addIssuance({
    assetAmount: editions,
    assetAddress: out.address,
    tokenAmount: 0,
    precision: 0,
    net: network,
  });

  return swap;
};

export const createSwap = async ({ asset, asking_asset, royalty }, amount) => {
  let out = royalty ? multisig() : payment();

  let swap = new Psbt().addOutput({
    asset: asking_asset,
    nonce: Buffer.alloc(1),
    script: out.output,
    value: amount,
  });

  await fund(swap, out, asset, 1, singleAnyoneCanPay, !!royalty);

  return swap;
};

export const createOffer = async (artwork, amount, fee) => {
  amount = parseInt(amount);
  fee = parseInt(fee);

  let { asking_asset: asset } = artwork;
  let out = payment();

  let swap = new Psbt()
    .addOutput({
      asset,
      nonce: Buffer.alloc(1),
      script: Address.toOutputScript(artwork.owner.address, network),
      value: amount,
    })
    .addOutput({
      asset: artwork.asset,
      nonce: Buffer.alloc(1),
      script: out.output,
      value: 1,
    })
    .addOutput({
      asset: btc,
      nonce: Buffer.alloc(1, 0),
      script: Buffer.alloc(0),
      value: fee,
    });

  if (asset === btc) {
    await fund(swap, out, asset, amount + fee);
  } else {
    await fund(swap, out, asset, amount);
    await fund(swap, out, btc, fee);
  }

  let ms = !!artwork.royalty;
  let pubkey = fromBase58(artwork.owner.pubkey, network).derive(0).publicKey;
  out = ms ? multisig({ pubkey }) : payment({ pubkey });

  await fund(swap, out, artwork.asset, 1, 1, ms);

  return swap;
};

export const sendToMultisig = async (artwork, fee) => {
  let out = payment();
  let { output: script } = multisig();
  let { asset, editions: value } = artwork;

  let swap = new Psbt()
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
      value: fee,
    });

  try {
    if (asset === btc) {
      await fund(swap, out, btc, value + fee);
    } else {
      await fund(swap, out, asset, value);
      await fund(swap, out, btc, fee);
    }
  } catch (e) {
    console.log(e.message);
  }

  return swap;
};

export const requestSignature = async (psbt) => {
  let { base64 } = await amp
    .url("/sign")
    .post({ psbt: psbt.toBase64() })
    .json();
  return Psbt.fromBase64(base64);
};
