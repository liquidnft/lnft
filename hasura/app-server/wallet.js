const { mnemonicToSeedSync } = require("bip39");
const { fromSeed } = require("bip32");
const { ECPair, Psbt, payments, networks } = require("@asoltys/liquidjs-lib");
const { electrs } = require("./api");

const network = networks.regtest;

const mnemonic =
  "actor plate kit job awful guilt myself reunion praise twenty exact firm";

const path = "m/84'/0'/0'/0/0";

const keypair = () => {
  let seed = mnemonicToSeedSync(mnemonic);
  let key = fromSeed(seed, network).derivePath(path);
  let { publicKey: pubkey, privateKey: privkey } = key;
  let base58 = key.neutered().toBase58();

  return { pubkey, privkey, seed, base58 };
};

const sign = (psbt, sighash = 1, privkey) => {
  //  throw new Error("no!");
  if (!privkey) ({ privkey } = keypair());
  psbt = Psbt.fromBase64(psbt);

  psbt.data.inputs.map((input, i) => {
    console.log(input);
    try {
      psbt = psbt
        .signInput(i, ECPair.fromPrivateKey(privkey), [input.sighashType])
        .finalizeInput(i);
    } catch (e) {
      console.log(e.message);
    }
  });

  return psbt;
};

module.exports = { keypair, sign };
