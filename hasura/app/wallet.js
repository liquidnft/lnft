import { mnemonicToSeedSync } from "bip39";
import { fromSeed } from "bip32";

import {
  address as Address,
  confidential,
  Psbt,
  Transaction,
  payments,
  networks,
} from "liquidjs-lib";

import { ECPair } from "./ecc.js";

import { electrs } from "./api.js";
import reverse from "buffer-reverse";

export const network =
  networks[
    process.env.LIQUID_ELECTRS_URL.includes("blockstream")
      ? "liquid"
      : "regtest"
  ];

export const btc = network.assetHash;

const mnemonic = process.env.SIGNING_SERVER_MNEMONIC;

const path = "m/84'/0'/0'/0/0";

export const keypair = () => {
  let seed = mnemonicToSeedSync(mnemonic);
  let key = fromSeed(seed, network).derivePath(path);
  let { publicKey: pubkey, privateKey: privkey } = key;
  let base58 = key.neutered().toBase58();

  return { pubkey, privkey, seed, base58 };
};

export const release = (a) => {
  return Psbt.fromBase64(a);
};

export const combine = (a, b) => {
  let c = Psbt.fromBase64(b);
  a = Psbt.fromBase64(a);
  b = Psbt.fromBase64(b);
  b.data.inputs[0] = a.data.inputs[0];
  let d = c.combine(b);
  d.data.inputs[0].sighashType = undefined;
  return d.toBase64();
};

export const sign = (psbt, sighash = 1, privkey) => {
  if (!privkey) ({ privkey } = keypair());
  psbt = Psbt.fromBase64(psbt);

  psbt.data.inputs.map((input, i) => {
    try {
      let sighashTypes = [1];
      if (input.sighashType) sighashTypes = [input.sighashType];

      psbt = psbt
        .signInput(i, ECPair.fromPrivateKey(privkey), sighashTypes)
        .finalizeInput(i);
    } catch (e) {
      // console.log("SIGNING ERROR", e.message);
    }
  });

  return psbt;
};

export const broadcast = async (psbt) => {
  let tx = psbt.extractTransaction();
  let hex = tx.toHex();

  return electrs.url("/tx").body(hex).post().text();
};

export const parseVal = (v) => parseInt(v.slice(1).toString("hex"), 16);
export const parseAsset = (v) => reverse(v.slice(1)).toString("hex");

export const parse = async (psbt) => {
  psbt = Psbt.fromBase64(psbt);
  let tx = psbt.__CACHE.__TX;

  let { ins } = tx;
  let inputs = [];

  for (let i = 0; i < ins.length; i++) {
    let { hash, index } = ins[i];
    let txid = reverse(hash).toString("hex");
    let input = (await electrs.url(`/tx/${txid}`).get().json()).vout[index];
    input.address = input.scriptpubkey_address;
    inputs.push(input);
  }

  let outputs = tx.outs.map((o) => {
    let address;

    try {
      address = Address.fromOutputScript(o.script, network);
    } catch (e) {}

    return {
      ...o,
      asset: parseAsset(o.asset),
      value: parseVal(o.value),
      address,
    };
  });

  return [tx.getId(), inputs, outputs];
};
