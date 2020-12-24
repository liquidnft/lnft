  import { fromSeed } from "bip32";
import { networks, payments } from "@asoltys/liquidjs-lib";
import { mnemonicToSeedSync } from "bip39";
import { fromSeed as slip77FromSeed } from "slip77";
import cryptojs from "crypto-js";

const network = networks["regtest"];

export default (mnemonic, password) => {
    let {
      AES: aes,
      enc: { Utf8 },
    } = cryptojs;

  mnemonic = aes.decrypt(mnemonic, password).toString(Utf8);
  let seed = mnemonicToSeedSync(mnemonic);
  let root = fromSeed(seed, network);
  let hd = root.derive(0);

  let p2wpkh = payments.p2wpkh({
    pubkey: hd.publicKey,
    network,
  });

  let nodeBlinding = slip77FromSeed(seed);
  let blindingKeyPair = nodeBlinding.derive(p2wpkh.output);

  let { address, redeem, output } = payments.p2sh({
    redeem: { output: p2wpkh.output },
    network,
    pubkey: hd.publicKey,
    // blindkey: blindingKeyPair.publicKey,
  });

  return { address, redeem, output, privateKey: hd.privateKey };
};
