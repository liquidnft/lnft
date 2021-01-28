const { mnemonicToSeedSync } = require("bip39");
const { fromSeed, fromBase58 } = require("bip32");
const {
  address: Address,
  confidential,
  crypto,
  ECPair,
  Psbt,
  payments,
  networks,
  script,
  Transaction,
} = require("@asoltys/liquidjs-lib");
const reverse = require("buffer-reverse");
const cryptojs = require("crypto-js");
const { fromSeed: slip77 } = require("slip77");
const { electrs } = require("./api");

const btc = "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225";

const network = networks.regtest;
const sighashType =
  Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY;

const parseVal = (v) => parseInt(v.slice(1).toString("hex"), 16);
const parseAsset = (v) => reverse(v.slice(1)).toString("hex");

const getHex = async (txid) => {
  return electrs.url(`/tx/${txid}/hex`).get().text();
};

const DUST = 1000;

const keypair = (mnemonic, pass) => {
  if (!mnemonic)
    mnemonic =
      "actor plate kit job awful guilt myself reunion praise twenty exact firm";
  let seed = mnemonicToSeedSync(mnemonic);
  let key = fromSeed(seed, network).derivePath("m/84'/0'/0'/0/0");
  let { publicKey: pubkey, privateKey: privkey } = key;
  let base58 = key.neutered().toBase58();

  return { pubkey, privkey, seed, base58 };
};

const unblind = (hex, vout) => {
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

const multisig = (pubkey) => {
  let redeem = payments.p2ms({
    m: 2,
    pubkeys: [Buffer.from(pubkey, "hex"), keypair().pubkey],
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

const sign = (psbt, sighash = 1, privkey) => {
//  throw new Error("no!");
  if (!privkey) ({ privkey } = keypair());
  psbt = Psbt.fromBase64(psbt)

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

const multipay = async (pubkey, amount, fee, to) => {
  let out = multisig(pubkey);

  let swap = new Psbt()
    .addOutput({
      asset: btc,
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

  try {
    await fund(swap, out, btc, amount + fee, 1, true);
  } catch (e) {
    console.log(e.message);
  }
  swap = sign(swap);
  swap = sign(
    swap,
    1,
    Buffer.from(
      "065b7fcb4cbf4674ed775f3634745ab113b5dd379ef19fe3578490f49f83268b",
      "hex"
    )
  );

  let tx = swap.extractTransaction();

  return tx.toHex();
};

const createSwap = async (asset, asking_asset, amount) => {
  let out = payment();

  let swap = new Psbt().addOutput({
    asset: asking_asset,
    nonce: Buffer.alloc(1),
    script: out.output,
    value: amount,
  });

  await fund(swap, out, asset, 1, sighashType);

  return swap;
};

const createOffer = async (artwork, amount, fee) => {
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

module.exports = { keypair, sign };
