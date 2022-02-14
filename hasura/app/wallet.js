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
} = require("liquidjs-lib");
const { electrs } = require("./api");
const reverse = require("buffer-reverse");

const network =
  networks[
    process.env.LIQUID_ELECTRS_URL.includes("blockstream")
      ? "liquid"
      : "regtest"
  ];

const btc = network.assetHash;

const mnemonic = process.env.SIGNING_SERVER_MNEMONIC;

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
};

const combine = (a, b) => {
  let c = Psbt.fromBase64(b);
  a = Psbt.fromBase64(a);
  b = Psbt.fromBase64(b);
  b.data.inputs[0] = a.data.inputs[0];
  let d = c.combine(b);
  d.data.inputs[0].sighashType = undefined;
  return d.toBase64();
};

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

module.exports = {
  btc,
  broadcast,
  combine,
  keypair,
  parseAsset,

  async parse(psbt) {
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
  },

  network,
  release,
  sign,
};
