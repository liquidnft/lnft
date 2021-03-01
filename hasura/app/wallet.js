const { mnemonicToSeedSync } = require("bip39");
const { fromSeed } = require("bip32");
const {
  address: Address,
  ECPair,
  Psbt,
  payments,
  networks,
} = require("@asoltys/liquidjs-lib");
const { electrs } = require("./api");
const reverse = require("buffer-reverse");

// const network = networks.liquid;
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
  if (!privkey) ({ privkey } = keypair());
  psbt = Psbt.fromBase64(psbt);

  psbt.data.inputs.map((input, i) => {
    try {
      let sighashTypes;
      if (input.sighashType) sighashTypes = [input.sighashType];

      psbt = psbt
        .signInput(i, ECPair.fromPrivateKey(privkey), sighashTypes)
        .finalizeInput(i);
    } catch (e) {
      // console.log(e.message); 
    }
  });

  return psbt;
};

let parseVal = (v) => parseInt(v.slice(1).toString("hex"), 16);
let parseAsset = (v) => reverse(v.slice(1)).toString("hex");

module.exports = {
  keypair,

  parse(psbt) {
    psbt = Psbt.fromBase64(psbt);
    return [psbt.__CACHE.__TX.getId(), psbt.__CACHE.__TX.outs.map((o) => {
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
    })];
  },

  sign,
};
