import { electrs } from "$lib/api";
import { mnemonicToSeedSync } from "bip39";
import { fromSeed } from "bip32";
import getAddress from "$lib/getAddress";
import { fromBase58 } from "bip32";
import {
  address as Address,
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

const btc = "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225";
const network = networks.regtest;
const sighashType =
  Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY;

let $user, $password;
password.subscribe((v) => ($password = v));
user.subscribe((v) => ($user = v));

const parseVal = (v) => parseInt(v.slice(1).toString("hex"), 16);
const parseAsset = (v) => reverse(v.slice(1)).toString("hex");

const getHex = async (txid) => {
  return electrs.url(`/tx/${txid}/hex`).get().text();
};

const keypair = (mnemonic, password) => {
  mnemonic = cryptojs.AES.decrypt(mnemonic, password).toString(
    cryptojs.enc.Utf8
  );
  if (!mnemonic) throw new Error("Unable to decrypt mnmemonic");
  return fromSeed(mnemonicToSeedSync(mnemonic), network).derivePath(
    "m/84'/0'/0'/0/0"
  );
};

export const payment = (pubkey) => {
  return payments.p2sh({
    redeem: payments.p2wpkh({
      pubkey,
      network,
    }),
    network,
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

const fund = async (psbt, out, asset, amount, sighashType = 1) => {
  let { address, redeem, output } = out;
  let utxos = shuffle(
    (await electrs.url(`/address/${address}/utxo`).get().json()).filter(
      (o) => o.asset === asset
    )
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
    psbt.addInput({
      hash: prevout.txid,
      index: prevout.vout,
      witnessUtxo: tx.outs[prevout.vout],
      redeemScript: redeem.output,
      sighashType,
    });
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

  let out = payment(keypair($user.mnemonic, $password).publicKey);
  if (asset === btc) {
    await fund(swap, out, asset, amount + fee);
  } else {
    await fund(swap, out, asset, amount);
    await fund(swap, out, btc, fee);
  }

  return swap;
};

export const cancelSwap = async (asset, fee) => {
  let out = payment(keypair($user.mnemonic, $password).publicKey);

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
  await fund(swap, out, btc, fee);

  return swap;
};

export const sign = (psbt, sighash) => {
  let addr = getAddress($user.mnemonic, $password);
  let { privateKey } = addr;
  psbt.data.inputs.map((_, i) => {
    try {
      psbt = psbt
        .signInput(i, ECPair.fromPrivateKey(privateKey), [sighash])
        .finalizeInput(i);
    } catch (e) {
      console.log(e.message);
    } // silently fail when signing an input that's not ours
  });

  return psbt;
};

export const broadcast = async (psbt) => {
  let tx = psbt.extractTransaction();
  let hex = tx.toHex();

  return electrs.url("/tx").body(hex).post().text();
};

export const executeSwap = async (swap, fee) => {
  let asset = swap.data.inputs[0].witnessUtxo.asset;
  let out = payment(keypair($user.mnemonic, $password).publicKey);
  let ask = swap.__CACHE.__TX.outs[0];

  await fund(swap, out, parseAsset(ask.asset), parseVal(ask.value));

  swap
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

  await fund(swap, out, btc, fee);
  return swap;
};

export const createIssuance = async (editions, fee) => {
  let addr = getAddress($user.mnemonic, $password);

  if (!addr) {
    snack.set("Failed to decrypt wallet");
    return;
  }

  let { address, output, redeem } = addr;

  let utxos = await electrs.url(`/address/${address}/utxo`).get().json();
  let prevout = utxos.find((utxo) => utxo.asset === btc && utxo.value >= fee);
  if (!prevout) throw new Error("Insufficient funds");

  let prevoutTx = Transaction.fromHex(await getHex(prevout.txid));

  return (
    new Psbt()
      .addInput({
        hash: prevout.txid,
        index: prevout.vout,
        witnessUtxo: prevoutTx.outs[prevout.vout],
        redeemScript: redeem.output,
      })
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
      })
      //change
      .addOutput({
        asset: btc,
        nonce: Buffer.alloc(1),
        script: output,
        value: Math.round(prevout.value - fee),
      })
      .addIssuance({
        assetAmount: editions,
        assetAddress: address,
        tokenAmount: 0,
        precision: 0,
        net: network,
      })
  );
};

export const createSwap = async (asset, asking_asset, amount) => {
  let out = payment(keypair($user.mnemonic, $password).publicKey);

  let swap = new Psbt().addOutput({
    asset: asking_asset,
    nonce: Buffer.alloc(1),
    script: out.output,
    value: amount,
  });

  await fund(swap, out, asset, 1, sighashType);

  return swap;
};

export const createOffer = async (artwork, amount, fee) => {
  amount = parseInt(amount);
  fee = parseInt(fee);

  let { asking_asset: asset } = artwork;
  let out = payment(keypair($user.mnemonic, $password).publicKey);

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

  let key = fromBase58(artwork.owner.pubkey, network).derive(0);
  let ownerOut = payment(key.publicKey);
  await fund(swap, ownerOut, artwork.asset, 1);

  if (asset === btc) {
    await fund(swap, out, asset, amount + fee);
  } else {
    await fund(swap, out, asset, amount);
    await fund(swap, out, btc, fee);
  }

  return swap;
};
