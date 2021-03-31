const { mnemonicToSeedSync } = require("bip39");
const { fromSeed } = require("bip32");
const {
  address: Address,
  confidential,
  ECPair,
  Psbt,
  Transaction,
  payments,
  networks,
} = require("@asoltys/liquidjs-lib");
const { electrs } = require("./api");
const reverse = require("buffer-reverse");

// const network = networks.liquid;
const network = networks.regtest;

const mnemonic =
  process.env.SIGNING_SERVER_MNEMONIC;

const path = "m/84'/0'/0'/0/0";

const keypair = () => {
  let seed = mnemonicToSeedSync(mnemonic);
  let key = fromSeed(seed, network).derivePath(path);
  let { publicKey: pubkey, privateKey: privkey } = key;
  let base58 = key.neutered().toBase58();

  return { pubkey, privkey, seed, base58 };
};

const release = (a) => {
  return Psbt.fromBase64(a);
} 

const combine = (a, b) => {
  let c = Psbt.fromBase64(b);
  a = Psbt.fromBase64(a)
  b = Psbt.fromBase64(b);
  b.data.inputs[0] = a.data.inputs[0];
  let d = c.combine(b);
  d.data.inputs[0].sighashType = undefined;
  return d.toBase64();
} 

const sign = (psbt, sighash = 1, privkey) => {
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

const broadcast = async (psbt) => {
  let tx = psbt.extractTransaction();
  let hex = tx.toHex();

  return electrs.url("/tx").body(hex).post().text();
};

let parseVal = (v) => parseInt(v.slice(1).toString("hex"), 16);
let parseAsset = (v) => reverse(v.slice(1)).toString("hex");

const unblind = (hex, vout, blindkey) => {
  let tx = Transaction.fromHex(hex)
  let output = tx.outs[vout];

  return confidential.unblindOutputWithKey(
    output,
    blindkey
  );
};

module.exports = {
  broadcast,
  combine,
  keypair,
  unblind,

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

  release,
  sign,
};

