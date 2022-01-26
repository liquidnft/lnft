import { tick } from "svelte";
import { get } from "svelte/store";
import { api, electrs, hasura } from "$lib/api";
// import * as middlewares from "wretch-middlewares";
import { mnemonicToSeedSync } from "bip39";
import { fromSeed } from "bip32";
import { fromBase58 } from "bip32";
import {
  address as Address,
  ECPair,
  Psbt,
  payments,
  networks,
  Transaction,
} from "liquidjs-lib";
import reverse from "buffer-reverse";
import {
  balances,
  fee,
  locked,
  pending,
  password,
  snack,
  user,
  poll,
  psbt,
  sighash,
  titles,
  transactions,
  token,
  signStatus,
  prompt,
} from "$lib/store";
import cryptojs from "crypto-js";
import { btc, info } from "$lib/utils";
import { requirePassword } from "$lib/auth";
import { getActiveBids } from "$queries/transactions";
import { compareAsc, parseISO } from "date-fns";
import { SignaturePrompt } from "$comp";

export const SIGN_CANCELLED = 'cancelled';
export const SIGN_ACCEPTED = 'accepted';

// const { retry } = middlewares.default || middlewares;

const DUST = 800;
const satsPerByte = 0.15;

const serverKey = Buffer.from(import.meta.env.VITE_PUBKEY, "hex");
const network = networks[import.meta.env.VITE_NETWORK];

const singleAnyoneCanPay =
  Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY;
const noneAnyoneCanPay =
  Transaction.SIGHASH_NONE | Transaction.SIGHASH_ANYONECANPAY;

export const parseVal = (v) => parseInt(v.slice(1).toString("hex"), 16);
export const parseAsset = (v) => reverse(v.slice(1)).toString("hex");

const nonce = Buffer.alloc(1);

export const getTransactions = () => {
  let { address } = get(user);
  if (!get(poll).find((p) => p.name === "txns"))
    poll.set([
      ...get(poll),
      {
        name: "txns",
        interval: setInterval(() => txns(), 10000),
      },
    ]);

  let txns = async () => {
    transactions.set(await electrs.url(`/address/${address}/txs`).get().json());
  };

  return txns();
};

export const getBalances = async () => {
  await requirePassword();

  let { confirmed: c, pending: p } = await api
    .auth(`Bearer ${get(token)}`)
    .url("/balance")
    .get()
    .json();

  Object.keys(c).map(async (a) => {
    let artwork = get(titles).find(
      (t) => t.asset === a && t.owner_id !== get(user).id
    );

    if (artwork) {
      await api
        .auth(`Bearer ${get(token)}`)
        .url("/claim")
        .post({ artwork })
        .json();
    }
  });

  balances.set(c);
  pending.set(p);
};

const getHex = async (txid) => {
  return electrs.url(`/tx/${txid}/hex`).get().text();
};

export const getTx = async (txid) => {
  return Transaction.fromHex(await getHex(txid));
};

export const createWallet = (mnemonic, pass) => {
  try {
    if (!pass) pass = get(password);
    if (!mnemonic) mnemonic = getMnemonic();

    mnemonic = cryptojs.AES.encrypt(mnemonic, pass).toString();

    const key = keypair(mnemonic, pass);
    let { pubkey, seed } = key;

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
  if (!mnemonic && get(user)) mnemonic = get(user).mnemonic;
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

  return payments.p2sh({
    redeem,
    network,
  });
};

export const multisig = (key) => {
  if (!key) key = keypair();

  let redeem = payments.p2ms({
    m: 2,
    pubkeys: [key.pubkey, serverKey].sort((a, b) =>
      a.toString("hex").localeCompare(b.toString("hex"))
    ),
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

export const getLocked = async (asset = btc) => {
  let arr = [];
  if (asset === btc) {
    try {
      let res = await hasura
        .auth(`Bearer ${get(token)}`)
        .post({
          query: getActiveBids(get(user).id),
        })
        .json();

      if (res.errors) {
        console.log(res.errors);
        throw new Error("problem fetching bids");
      }

      res.data.activebids.map(async ({ artwork, id, psbt, type }) => {
        let p = Psbt.fromBase64(psbt);
        let { tx } = p.data.globalMap.unsignedTx;

        arr.push({
          id,
          type,
          amount: tx.outs
            .filter(
              (o) =>
                parseAsset(o.asset) === btc &&
                Buffer.compare(o.script, singlesig().output) !== 0
            )
            .reduce((a, b) => a + parseVal(b.value), 0),
          artwork,
          p,
        });
      });
    } catch (e) {
      console.log(e);
    }
  }

  locked.set(arr.reduce((a, b) => a + b.amount, 0));
  return arr;
};

const splitUp = async (tx) => {
  let { artwork, id, p, type } = tx;
  let { has_royalty, royalty_recipients, artist_id, owner_id } = artwork;
  let asset = btc;
  let { ins, outs } = p.data.globalMap.unsignedTx.tx;
  outs = outs.filter((o) => parseAsset(o.asset) === btc);

  let total = outs.reduce((a, b) => a + parseVal(b.value), 0);

  let change = outs.find(
    (o) => Buffer.compare(o.script, singlesig().output) === 0
  );

  let fee = parseVal(outs.find((o) => !o.script.length).value);
  let splitFee = fee + 100;

  if (change) change = parseVal(change.value);

  let padding = Math.max(0, DUST - (total - change));

  let p2 = new Psbt();
  let add = async ({ hash, index }) =>
    p2.addInput({
      hash,
      index,
      redeemScript: singlesig().redeem.output,
      nonWitnessUtxo: Buffer.from(
        await getHex(reverse(hash).toString("hex")),
        "hex"
      ),
    });

  if (type === "bid") {
    for (let i = 1; i < ins.length; i++) {
      await add(ins[i]);
    }
  } else await add(ins[0]);

  p2.addOutput({
    asset,
    nonce,
    script: singlesig().output,
    value: total + padding - change,
  })
    .addOutput({
      asset,
      nonce,
      script: singlesig().output,
      value: change - padding - splitFee,
    })
    .addOutput({
      asset,
      nonce,
      script: Buffer.alloc(0),
      value: splitFee,
    });

  psbt.set(p2);
  await sign();
  await broadcast(true);

  let t = p2.extractTransaction();

  let totalValue = total - change - fee;
  let value = totalValue;
  if (has_royalty && artist_id !== owner_id) {
    let totalRoyalty = royalty_recipients.reduce((a, b) => (a += b.amount), 0);
    value = Math.round((value * 100) / (100 + totalRoyalty));
  }

  let input = {
    hash: t.getId(),
    index: 0,
    redeemScript: singlesig().redeem.output,
    nonWitnessUtxo: t.toBuffer(),
  };

  let p3;
  if (type === "bid") p3 = await createOffer(artwork, value, input, fee);
  else {
    ({ hash, index } = ins[1]);
    p3 = new Psbt()
      .addInput(input)
      .addInput({
        index,
        hash,
        nonWitnessUtxo: Buffer.from(
          await getHex(reverse(hash).toString("hex")),
          "hex"
        ),
        redeemScript: multisig().redeem.output,
        witnessScript: multisig().redeem.redeem.output,
      })
      .addOutput({
        asset: artwork.asset,
        nonce,
        script: singlesig().output,
        value: 1,
      })
      .addOutput({
        asset,
        nonce,
        script: singlesig().output,
        value: padding + fee,
      })
      .addOutput({
        asset,
        nonce,
        script: Buffer.alloc(0),
        value: fee,
      });
  }

  psbt.set(p3);
  await sign();

  await api
    .url("/tx/update")
    .auth(`Bearer ${get(token)}`)
    .post({
      id,
      psbt: p3.toBase64(),
    })
    .json()
    .catch(console.log);

  if (type === "auction") {
    await api
      .url("/release/update")
      .auth(`Bearer ${get(token)}`)
      .post({
        id: artwork.id,
        psbt: p3.toBase64(),
      })
      .json()
      .catch(console.log);
  }

  return {
    amt: change - padding - splitFee,
    input: {
      hash: t.getId(),
      index: 1,
      redeemScript: singlesig().redeem.output,
      nonWitnessUtxo: t.toBuffer(),
    },
  };
};

const fund = async (
  p,
  out,
  asset,
  amount,
  sighashType = 1,
  multisig = false
) => {
  let { address, redeem, output } = out;

  let utxos = await api.url(`/address/${address}/utxo`).get().json();
  let l = (await getLocked(asset))
    .filter((t) => !(p.artwork_id && t.artwork.id === p.artwork_id))
    .map((t) => {
      t.inputs = t.p.data.globalMap.unsignedTx.tx.ins.map(
        ({ hash, index }) => ({
          hash: reverse(hash).toString("hex"),
          index,
        })
      );
      return t;
    });

  utxos = shuffle(
    utxos.filter(
      (o) =>
        o.asset === asset &&
        (o.asset !== btc || o.value > DUST) &&
        !l.find((t) =>
          t.inputs.find((i) => i.hash === o.txid && i.index === o.vout)
        )
    )
  );

  let i = 0;
  let total = 0;

  while (total < amount) {
    if (i >= utxos.length) {
      if (asset === btc) {
        let arr = l
          .reduce((a, b) => {
            b.change = b.p.data.globalMap.unsignedTx.tx.outs.find(
              ({ script, value }) =>
                script.toString("hex") === singlesig().output.toString("hex") &&
                parseVal(value) > DUST
            );

            if (b.change) a.push(b);
            return a;
          }, [])
          .sort((a, b) => parseVal(b.change.value) - parseVal(a.change.value));

        if (
          arr.reduce((a, b) => a + parseVal(b.change.value), 0) >=
          amount - total
        ) {
          for (let k = 0; k < arr.length; k++) {
            try {
              let { input, amt } = await splitUp(arr[k]);
              utxos.push({ input });
              total += amt;
              i++;
              if (total >= amount) break;
            } catch (e) {
              console.log("failed to split bid", e.message, e.stack);
            }
          }
        }
      }

      if (total < amount) {
        throw { message: "Insufficient funds", amount, asset, total };
      }
    } else {
      total += utxos[i].value;
      i++;
    }
  }

  for (var j = 0; j < i; j++) {
    let prevout = utxos[j];

    let { input, vout, txid, hex } = prevout;
    if (!hex) hex = await getHex(txid);
    if (!input) {
      input = {
        hash: txid,
        index: vout,
        redeemScript: redeem.output,
        nonWitnessUtxo: Buffer.from(hex, "hex"),
        sighashType,
      };
    }

    if (multisig) {
      input.witnessScript = redeem.redeem.output;
    }

    p.addInput(input);
  }

  if (total > amount) {
    if (total - amount > DUST || asset !== btc) {
      let changeIndex = p.data.outputs.length;

      p.addOutput({
        asset,
        nonce,
        script: multisig ? singlesig().output : out.output,
        value: total - amount,
      });
    } else bumpFee(total - amount);
  }
};

const addFee = (p) =>
  p.addOutput({
    asset: btc,
    nonce,
    script: Buffer.alloc(0),
    value: get(fee),
  });

const bumpFee = (v) => fee.set(get(fee) + v);

export const isMultisig = ({ auction_end }) => {
  return !!(
    (auction_end && compareAsc(parseISO(auction_end), new Date()) > 0)
  );
};

export const releaseToSelf = async (artwork) => {
  fee.set(100);
  let { asset, owner } = artwork;

  let script;
  try {
    script = Address.toOutputScript(owner.address, network);
  } catch (e) {
    throw new Error("Unrecognized address");
  }

  let p = new Psbt().addOutput({
    asset,
    nonce,
    script,
    value: 1,
  });

  let p2 = Psbt.fromBase64(p.toBase64());

  let construct = async (p) => {
    await fund(p, multisig(), asset, 1, 1, true);
    await fund(p, singlesig(), btc, get(fee));
  };

  await construct(p);
  addFee(p);

  estimateFee(p);
  await construct(p2);

  addFee(p2);

  return p2;
};

export const pay = async (artwork, to, amount) => {
  fee.set(100);
  if (!amount || amount <= 0) throw new Error("invalid amount");
  let asset = artwork ? artwork.asset : btc;

  let script;
  try {
    script = Address.toOutputScript(to, network);
  } catch (e) {
    throw new Error("Unrecognized address");
  }

  amount = parseInt(amount);

  let p = new Psbt().addOutput({
    asset,
    nonce,
    script,
    value: amount,
  });

  let total = amount;

  let p2 = Psbt.fromBase64(p.toBase64());

  let construct = async (p) => {
    let out = artwork && isMultisig(artwork) ? multisig() : singlesig();
    if (asset === btc) {
      await fund(p, singlesig(), asset, amount + get(fee));
    } else {
      await fund(p, out, asset, amount, 1, isMultisig(artwork));
      await fund(p, singlesig(), btc, get(fee));
    }
  };

  await construct(p);
  addFee(p);

  let confidential;
  try {
    confidential = Address.isConfidential(to);
  } catch (e) {
    confidential = false;
  }

  estimateFee(p, confidential);
  await construct(p2);

  addFee(p2);

  return p2;
};

const estimateFee = (p, isConfidential = false) => {
  let size = estimateTxSize(
    p.data.inputs.length,
    p.data.outputs.length,
    isConfidential
  );
  fee.set(Math.ceil(size * satsPerByte));
};

export const cancelSwap = async (artwork) => {
  let { asset } = artwork;
  let out = isMultisig(artwork) ? multisig() : singlesig();

  let p = new Psbt().addOutput({
    asset,
    nonce,
    script: out.output,
    value: 1,
  });

  await fund(p, out, asset, 1);
  await fund(p, singlesig(), btc, get(fee));

  addFee(p);

  return p;
};

export const requireSign = async () => {
  signStatus.set(false);

  return await new Promise(
    (resolve) =>
      (signStatus.subscribe((signedSub) => {
        signedSub ? resolve(signedSub) : prompt.set(SignaturePrompt);
      }))
  );
};

export const sign = async (sighash) => {
  let p = get(psbt);
  const loggedUser = get(user);

  let { privkey } = keypair();

  if(loggedUser.prompt_sign) {
    const signResult = await requireSign();

    if(signResult === SIGN_CANCELLED){
      throw new Error('Signing cancelled');
    }

    info('Transaction signed!');
  }

  p.data.inputs.map(({ sighashType }, i) => {
    try {
      p = p
        .signInput(i, ECPair.fromPrivateKey(privkey), [
          sighash || sighashType || 1,
        ])
        .finalizeInput(i);
    } catch (e) {
      // console.log("failed to sign", e.message, i);
    }
  });

  psbt.set(p);
  return p;
};

export const broadcast = (disableRetries = false) => {
  let tx = get(psbt).extractTransaction();
  let hex = tx.toHex();
  let middlewares = [
    // retry({
    //   delayTimer: 6000,
    //   maxAttempts: 3,
    // }),
  ];

  if (disableRetries) middlewares = [];

  return electrs.url("/tx").middlewares(middlewares).body(hex).post().text();
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
    has_royalty,
    royalty_recipients,
    artist: { address },
    artist_id,
    owner_id,
  } = artwork;
  let p = Psbt.fromBase64(list_price_tx);
  let out = singlesig();
  let script = singlesig().output;
  let total = list_price;

  fee.set(100);

  p.addOutput({
    asset,
    nonce,
    script,
    value: 1,
  });

  if (artist_id !== owner_id && has_royalty) {
    for (let i = 0; i < royalty_recipients.length; i++) {
      const element = royalty_recipients[i];

      const recipientValue = Math.round((list_price * element.amount) / 100);
      total += recipientValue;

      p.addOutput({
        asset: asking_asset,
        value: recipientValue,
        nonce,
        script: Address.toOutputScript(element.address, network),
      });
    }
  }

  let p2 = Psbt.fromBase64(p.toBase64());

  let construct = async (p, total) => {
    if (asking_asset === btc) total += get(fee);
    else await fund(p, out, btc, get(fee));
    await fund(p, out, asking_asset, total);
  };

  await construct(p, total);
  addFee(p);
  estimateFee(p);

  await construct(p2, total);

  addFee(p2);

  return p2;
};

export const createIssuance = async (
  { filename: file, title: name, ticker },
  domain,
  tx
) => {
  let out = singlesig();
  fee.set(50);

  let p = new Psbt().addOutput({
    asset: btc,
    nonce,
    script: payments.embed({ data: [Buffer.alloc(1)] }).output,
    value: 0,
  });

  if (tx) {
    let index = tx.outs.findIndex(
      (o) =>
        parseAsset(o.asset) === btc &&
        o.script.toString("hex") === out.output.toString("hex")
    );

    if (index > -1) {
      let input = {
        index,
        hash: tx.getId(),
        nonWitnessUtxo: Buffer.from(tx.toHex(), "hex"),
        redeemScript: out.redeem.output,
      };

      p.addInput(input);

      let value = parseVal(tx.outs[index].value) - get(fee);

      if (value > DUST)
        p.addOutput({
          asset: btc,
          nonce,
          script: out.output,
          value,
        });
      else bumpFee(value);
    }
  } else {
    await fund(p, out, btc, get(fee), 1, false, false);
  }

  let contract = {
    entity: { domain },
    file,
    issuer_pubkey: keypair().pubkey.toString("hex"),
    name,
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

  addFee(p);

  psbt.set(p);

  return contract;
};

export const signOver = async ({ asset }, tx) => {
  let p = new Psbt();

  if (!tx) {
    let utxos = await electrs
      .url(`/address/${multisig().address}/utxo`)
      .get()
      .json();
    let prevout = utxos.find((o) => o.asset === asset);
    let hex = await getHex(prevout.txid);
    tx = Transaction.fromHex(hex);
  }

  let index = tx.outs.findIndex((o) => parseAsset(o.asset) === asset);

  p.addInput({
    index,
    hash: tx.getId(),
    nonWitnessUtxo: Buffer.from(tx.toHex(), "hex"),
    redeemScript: multisig().redeem.output,
    witnessScript: multisig().redeem.redeem.output,
    sighashType: noneAnyoneCanPay,
  });

  psbt.set(p);
  sign(noneAnyoneCanPay);
  return tx;
};

export const createRelease = async ({ asset, owner }, tx) => {
  let p = new Psbt().addOutput({
    asset,
    nonce,
    script: Address.toOutputScript(owner.address, network),
    value: 1,
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
        nonce,
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

  addFee(p);

  psbt.set(p);

  return sign();
};

export const createSwap = async (artwork, amount, tx) => {
  let { asset, asking_asset } = artwork;

  if (asking_asset === btc && amount < DUST)
    throw new Error(
      `Minimum asking price is ${(DUST / 100000000).toFixed(8)} L-BTC`
    );

  let p = new Psbt().addOutput({
    asset: asking_asset,
    nonce,
    script: singlesig().output,
    value: amount,
  });

  if (tx) {
    let index = tx.outs.findIndex((o) => parseAsset(o.asset) === asset);

    if (isMultisig(artwork)) {
      p.addInput({
        index,
        hash: tx.getId(),
        nonWitnessUtxo: Buffer.from(tx.toHex(), "hex"),
        redeemScript: multisig().redeem.output,
        witnessScript: multisig().redeem.redeem.output,
        sighashType: singleAnyoneCanPay,
      });
    } else {
      p.addInput({
        index,
        hash: tx.getId(),
        nonWitnessUtxo: Buffer.from(tx.toHex(), "hex"),
        redeemScript: singlesig().redeem.output,
        sighashType: singleAnyoneCanPay,
      });
    }
  } else {
    await fund(
      p,
      isMultisig(artwork) ? multisig() : singlesig(),
      asset,
      1,
      singleAnyoneCanPay,
      isMultisig(artwork)
    );
  }

  return p;
};

export const createOffer = async (artwork, amount, input, f = 150) => {
  fee.set(f);
  amount = parseInt(amount);

  let {
    asking_asset: asset,
    artist_id,
    has_royalty,
    royalty_recipients,
    owner_id,
  } = artwork;

  if (asset === btc && amount < DUST)
    throw new Error(`Minimum bid is ${(DUST / 100000000).toFixed(8)} L-BTC`);

  let out = singlesig();

  let p = new Psbt().addOutput({
    asset,
    nonce,
    script: Address.toOutputScript(artwork.owner.address, network),
    value: amount,
  });

  let total = parseInt(amount);
  let pubkey = fromBase58(artwork.owner.pubkey, network).publicKey;

  if (has_royalty) {
    if (artist_id !== owner_id) {
      for (let i = 0; i < royalty_recipients.length; i++) {
        const element = royalty_recipients[i];

        const recipientValue = Math.round(
          (parseInt(amount) * element.amount) / 100
        );
        total += recipientValue;

        p.addOutput({
          asset,
          value: recipientValue,
          nonce,
          script: Address.toOutputScript(element.address, network),
        });
      }
    }

    p.addOutput({
      asset: artwork.asset,
      nonce,
      script: isMultisig(artwork) ? multisig().output : singlesig().output,
      value: 1,
    });
  } else {
    p.addOutput({
      asset: artwork.asset,
      nonce,
      script: out.output,
      value: 1,
    });
  }

  try {
    await fund(
      p,
      isMultisig(artwork) ? multisig({ pubkey }) : singlesig({ pubkey }),
      artwork.asset,
      1,
      1,
      isMultisig(artwork)
    );
  } catch (e) {
    console.log(e);
    throw new Error(
      "Unable to construct offer, the asset could not be found in the owner's wallet"
    );
  }

  let p2 = Psbt.fromBase64(p.toBase64());

  let construct = async (p, total) => {
    if (asset === btc) {
      total += get(fee);
    } else {
      await fund(p, out, btc, get(fee));
    }

    p.artwork_id = artwork.id;
    await fund(p, out, asset, total);
  };

  if (input) {
    p.addInput(input);
    addFee(p);
    return p;
  } else {
    await construct(p, total);
    addFee(p);
    estimateFee(p);

    await construct(p2, total);

    addFee(p2);
    return p2;
  }
};

export const sendToMultisig = async (artwork) => {
  let out = singlesig();
  let { output: script } = multisig();
  let { asset } = artwork;
  let value = 1;

  let p = new Psbt().addOutput({
    asset,
    nonce,
    script,
    value,
  });

  await fund(p, out, asset, value);
  await fund(p, out, btc, get(fee));
  addFee(p);

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

export function estimateTxSize(numInputs, numOutputs, isConfidential = false) {
  const base = calcTxSize(false, numInputs, numOutputs, false) + 200;
  const total = calcTxSize(true, numInputs, numOutputs, isConfidential);
  const weight = base * 3 + total;
  const vsize = (weight + 3) / 4;

  return vsize;
}

function calcTxSize(withWitness, numInputs, numOutputs, isConfidential) {
  const inputsSize = calcInputsSize(withWitness, numInputs);
  const outputsSize = calcOutputsSize(isConfidential, numOutputs);

  return (
    9 +
    varIntSerializeSize(numOutputs) +
    varIntSerializeSize(numInputs) +
    inputsSize +
    outputsSize
  );
}

function calcInputsSize(withWitness, numInputs) {
  // prevout hash + prevout index
  let size = (32 + 8) * numInputs;
  if (withWitness) {
    // scriptsig + pubkey
    size += numInputs * (72 + 33);
  }

  return size;
}

function calcOutputsSize(isConfidential, numOutputs) {
  // asset + value + empty nonce
  const baseOutputSize = 33 + 33 + 1;
  let size = baseOutputSize * numOutputs;

  if (isConfidential) {
    // rangeproof + surjectionproof + 32 bytes for nonce
    size += (4174 + 67 + 32) * numOutputs;
  }

  // fee asset + fee empty nonce + fee value
  size += 33 + 1 + 9;

  return size;
}

function varIntSerializeSize(val) {
  const maxUINT16 = 65535;
  const maxUINT32 = 4294967295;

  if (val < 0xfd) {
    return 1;
  }

  if (val <= maxUINT16) {
    return 3;
  }

  if (val <= maxUINT32) {
    return 5;
  }

  return 9;
}
