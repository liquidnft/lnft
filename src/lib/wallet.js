import { electrs } from "$lib/api";
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
const btc = "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225";
const network = networks.regtest;
const sighashType =
  Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY;

let $user, $password;
password.subscribe((v) => ($password = v));
user.subscribe((v) => ($user = v));

let getHex = async (txid) => {
  return electrs.url(`/tx/${txid}/hex`).get().text();
};

export const pay = async (asset, to, amount, fee) => {
  amount = parseInt(amount);
  fee = parseInt(fee);
  let total = amount;
  if (asset === btc) total += fee;

  let addr = getAddress($user.mnemonic, $password);
  let { address, output, redeem, privateKey } = addr;
  let utxos = await electrs.url(`/address/${address}/utxo`).get().json();

  let prevout = utxos.find(
    (utxo) => utxo.asset === asset && utxo.value >= total
  );

  if (!prevout) throw new Error("Insufficient funds");
  let change = prevout.value - total;

  let feePrevout, feePrevoutTx, feeChange;
  if (asset !== btc) {
    feePrevout = utxos.find((utxo) => utxo.asset === btc && utxo.value >= fee);
    if (!feePrevout) throw new Error("Insufficient funds");
    feePrevoutTx = Transaction.fromHex(await getHex(feePrevout.txid));
    feeChange = feePrevout.value - fee;
  }

  let prevoutTx = Transaction.fromHex(await getHex(prevout.txid));

  let swap = new Psbt()
    .addInput({
      hash: prevout.txid,
      index: prevout.vout,
      witnessUtxo: prevoutTx.outs[prevout.vout],
      redeemScript: redeem.output,
    })
    // asset
    .addOutput({
      asset,
      nonce: Buffer.alloc(1),
      script: Address.toOutputScript(to, network),
      value: amount,
    })
    // fee
    .addOutput({
      asset: btc,
      nonce: Buffer.alloc(1, 0),
      script: Buffer.alloc(0),
      value: fee,
    });

  console.log(change, feePrevout, feeChange);
  if (change)
    swap.addOutput({
      asset,
      nonce: Buffer.alloc(1),
      script: output,
      value: change,
    });

  if (feePrevout)
    swap.addInput({
      hash: feePrevout.txid,
      index: feePrevout.vout,
      witnessUtxo: feePrevoutTx.outs[feePrevout.vout],
      redeemScript: redeem.output,
    });

  if (feeChange)
    swap.addOutput({
      asset: btc,
      nonce: Buffer.alloc(1),
      script: output,
      value: feeChange,
    });

  return swap;
};

export const sign = (psbt) => {
  let addr = getAddress($user.mnemonic, $password);
  let { privateKey } = addr;
  psbt.data.inputs.map((_, i) => {
    try {
      psbt = psbt
        .signInput(i, ECPair.fromPrivateKey(privateKey))
        .finalizeInput(i);
    } catch (e) {} // silently fail when signing an input that's not ours
  });

  return psbt;
};

export const broadcast = async (psbt) => {
  let tx = psbt.extractTransaction();
  let hex = tx.toHex();

  return electrs.url("/tx").body(hex).post().text();
};

export const executeSwap = async (psbt) => {
  let addr = getAddress($user.mnemonic, $password);
  let { address, output, redeem, privateKey } = addr;
  let utxos = await electrs.url(`/address/${address}/utxo`).get().json();

  let fee = 100000;

  // todo more sophisticated coin selection
  let prevout = utxos.find((utxo) => utxo.asset === btc && utxo.value >= fee);
  let prevoutTx = Transaction.fromHex(await getHex(prevout.txid));

  let change =
    prevout.value -
    psbt.__CACHE.__TX.outs.reduce(
      (a, b) => a + parseInt(b.value.slice(1).toString("hex"), 16),
      0
    ) -
    fee;

  let asset = psbt.data.inputs[0].witnessUtxo.asset;

  return (
    psbt
      .addInput({
        hash: prevout.txid,
        index: prevout.vout,
        witnessUtxo: prevoutTx.outs[prevout.vout],
        redeemScript: redeem.output,
      })
      // asset
      .addOutput({
        asset,
        nonce: Buffer.alloc(1),
        script: output,
        value: 1,
      })
      // fee
      .addOutput({
        asset: btc,
        nonce: Buffer.alloc(1, 0),
        script: Buffer.alloc(0),
        value: fee,
      })
      //change
      .addOutput({
        asset: btc,
        nonce: Buffer.alloc(1),
        script: output,
        value: change,
      })
  );
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

export const createSwap = async (asset, price) => {
  let { address, output, redeem, privateKey } = getAddress(
    $user.mnemonic,
    $password
  );

  let utxos = await electrs.url(`/address/${address}/utxo`).get().json();
  let prevout = utxos.find((utxo) => utxo.asset === asset);

  if (!prevout) throw new Error("Insufficient funds");
  let prevoutTx = Transaction.fromHex(await getHex(prevout.txid));

  return new Psbt()
    .addInput({
      hash: prevoutTx.getId(),
      index: prevout.vout,
      witnessUtxo: prevoutTx.outs[prevout.vout],
      redeemScript: redeem.output,
      sighashType,
    })
    .addOutput({
      asset: btc,
      nonce: Buffer.alloc(1),
      script: output,
      value: Math.round(price),
    })
    .signInput(0, ECPair.fromPrivateKey(privateKey), [sighashType])
    .finalizeInput(0);
};

export const createOffer = async (artwork, price) => {
  let { address, output, redeem, privateKey } = getAddress(
    $user.mnemonic,
    $password
  );

  let fee = 100000;
  let total = parseInt(price);
  if (artwork.asking_asset === btc) total += fee;

  let utxos = await electrs.url(`/address/${address}/utxo`).get().json();
  let prevout = utxos.find(
    (utxo) => utxo.asset === artwork.asking_asset && utxo.value >= total
  );
  if (!prevout) throw new Error("Insufficient funds");
  let prevoutTx = Transaction.fromHex(await getHex(prevout.txid));
  let change = prevout.value - total;

  let artworkUtxos = await electrs
    .url(`/address/${artwork.owner.address}/utxo`)
    .get()
    .json();
  let artworkPrevout = artworkUtxos.find(
    (utxo) => utxo.asset === artwork.asset
  );
  let artworkPrevoutTx = Transaction.fromHex(await getHex(artworkPrevout.txid));

  let hd = fromBase58(artwork.owner.pubkey, network).derive(0);
  let { output: redeemScript } = payments.p2wpkh({
    pubkey: hd.publicKey,
    network,
  });

  return (
    new Psbt()
      // bid input
      .addInput({
        hash: prevoutTx.getId(),
        index: prevout.vout,
        witnessUtxo: prevoutTx.outs[prevout.vout],
        redeemScript: redeem.output,
      })
      // artwork input
      .addInput({
        hash: artworkPrevoutTx.getId(),
        index: artworkPrevout.vout,
        witnessUtxo: artworkPrevoutTx.outs[artworkPrevout.vout],
        redeemScript,
      })
      // bid
      .addOutput({
        asset: artwork.asking_asset,
        nonce: Buffer.alloc(1),
        script: Address.toOutputScript(artwork.owner.address, network),
        value: Math.round(price),
      })
      // artwork
      .addOutput({
        asset: artwork.asset,
        nonce: Buffer.alloc(1),
        script: output,
        value: 1,
      })
      // fee
      .addOutput({
        asset: btc,
        nonce: Buffer.alloc(1, 0),
        script: Buffer.alloc(0),
        value: fee,
      })
      //change
      .addOutput({
        asset: artwork.asking_asset,
        nonce: Buffer.alloc(1),
        script: output,
        value: change,
      })
  );
};
