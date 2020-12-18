<script>
  import buffer from "buffer";
  import { generateMnemonic, mnemonicToSeedSync } from "bip39";
  import { fromSeed } from "bip32";
  import { fromSeed as slip77FromSeed } from "slip77";
  import {
    crypto,
    payments,
    ECPair,
    networks,
    Psbt,
    confidential,
    Transaction,
  } from "@asoltys/liquidjs-lib";
  import { liquid } from "$lib/api";
  // import QrCode from "svelte-qrcode";
  import { onMount } from "svelte";
  import { user, token } from "$lib/store";
  import { mutation, subscription, operationStore } from "@urql/svelte";
  import reverse from "buffer-reverse";

  const btc =
    "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225";

  function randomHash(nBytes) {
    let u = new Uint8Array(nBytes);
    window.crypto.getRandomValues(u);
    return u;
    /*
    return Array.from(u)
      .map((n) => n.toString(16))
      .join("");
     */
  }

  let createAddress = {
    query: `mutation create_address($address: address_insert_input!) {
    insert_addresses_one(object: $address) {
      id,
      user_id
    } 
  }`,
  };

  let address,
  unblinded,
    asset,
    txid,
    hash,
    hex,
    psbt,
    ria,
    tx,
    root,
    network,
    seed,
    decoded,
    vout,
    address_receive,
    blindingKeyPair,
    payment,
    confidentialAddress;
  let addrIndex = 0;
  let keys = [];

  let getAddress = () => {
    const hd = root.derive(addrIndex);
    keys[addrIndex] = hd;
    addrIndex++;

    let p2wpkh = payments.p2wpkh({
      pubkey: hd.publicKey,
      network,
    });

    const nodeBlinding = slip77FromSeed(seed);
    const blindingKeyPair = nodeBlinding.derive(p2wpkh.output);
    let payment = payments.p2sh({
      redeem: { output: p2wpkh.output },
      network,
      pubkey: hd.publicKey,
      // blindkey: blindingKeyPair.publicKey,
    });

    return { payment, blindingKeyPair };
  };

  onMount(async () => {
    network = networks["regtest"];
    seed = mnemonicToSeedSync(generateMnemonic());
    root = fromSeed(seed, network);

    ({ payment, blindingKeyPair } = getAddress());
    ({ address } = payment);
    ({ asset, hex, unblinded, txid, decoded, ria } = await liquid
      .url(
        `/asset?address=${address}&privateKey=${blindingKeyPair.privateKey.toString(
          "hex"
        )}`
      )
      .auth(`Bearer ${$token}`)
      .get()
      .json());

    console
    tx = Transaction.fromHex(unblinded);

    vout = tx.outs.findIndex((o) => {
      return reverse(o.asset.slice(1)).toString("hex") === asset && parseInt(buffer.Buffer.from(o.value).slice(1).toString('hex')) === 1;
    });

    let asset_receive = btc;
    let amount_receive = 1000;
    let payment_out;
    ({ payment: payment_out, blindingKeyPair } = getAddress());
    ({ address: address_receive } = payment);

    let json = await liquid
      .url(
        `/swap?address=${address_receive}&amount=${amount_receive}&asset=${btc}&txid=${txid}&vout=${vout}`
      )
      .auth(`Bearer ${$token}`)
      .get()
      .json();

    let pair = new ECPair.fromPrivateKey(keys[0].privateKey, {
      compressed: true,
      network,
    });
    let ps = Psbt.fromBase64(json.psbt);
    let utxo = decoded.vout[vout];
    let script = buffer.Buffer.from(utxo.scriptPubKey.hex, "hex");
    console.log("script", script, utxo.scriptPubKey);
    console.log("payment", payment);
    ps.updateInput(0, {
      nonWitnessUtxo: buffer.Buffer.from(unblinded, "hex"),
      redeemScript: payment.redeem.output,
    });
    console.log(ps);

    const fromHexString = (hexString) =>
      new Uint8Array(
        hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
      );

    // fee
    ps.addOutput({
      asset: btc,
      script: buffer.Buffer.alloc(0),
      value: 5000,
      nonce: buffer.Buffer.alloc(1, 0),
    });

    ps.signInput(0, pair, Transaction.ANYONECANPAY & Transaction.SIGHASH_SINGLE);
    ps.finalizeAllInputs();
    let finalTx = ps.extractTransaction();
    console.log(finalTx.toHex());

    /*

    tx = connection.call(
        "createrawtransaction",
        [{"txid": txid, "vout": vout, "sequence": 0xffffffff}],
        {address: amount_receive},
        0,
        False,
        {address: asset_receive})

    asset_blinder_bytes = os.urandom(32)
    amount_blinder_bytes = os.urandom(32)
    asset_commitment = wally.asset_generator_from_bytes(h2b_rev(asset_receive), asset_blinder_bytes)
    amount_commitment = wally.asset_value_commitment(btc2sat(amount_receive), amount_blinder_bytes, asset_commitment)

    tx_ = wally.tx_from_hex(tx, wally.WALLY_TX_FLAG_USE_WITNESS | wally.WALLY_TX_FLAG_USE_ELEMENTS)
    wally.tx_set_output_asset(tx_, 0, asset_commitment)
    wally.tx_set_output_value(tx_, 0, amount_commitment)
    tx = wally.tx_to_hex(tx_, wally.WALLY_TX_FLAG_USE_WITNESS | wally.WALLY_TX_FLAG_USE_ELEMENTS)

    ret = connection.call(
        "signrawtransactionwithwallet",
        tx,
        None,
        "SINGLE|ANYONECANPAY")
     */
  });

  let addresses;
  let liquality = () => {
    window.bitcoin.enable().then(() => {
      window.bitcoin.request({ method: "wallet_getAddresses" }).then((r) => {
        addresses = r;
      });
    });
  };

  let generate = () => {
    liquid
      .url(`/generate?address=${address}`)
      .auth(`Bearer ${$token}`)
      .get()
  } 
</script>

<style>
  button {
    @apply border border-black w-full uppercase text-sm font-bold py-2 px-4 rounded my-4;
  }

  .stuff div {
    @apply my-4;
  }
</style>

{#if $user}
  <h1 class="title">Wallet</h1>

  <button on:click={generate}>Show me the money!</button>

  <!--<QrCode value={address} />-->
  <div class="break-all p-8 stuff">
    <div>Address {address} {confidentialAddress}</div>
    <div>Txid {txid}</div>

    <div>
      {#if psbt}{JSON.stringify(psbt.toBuffer())}{/if}
    </div>

    <div>{ria}</div>
    <div>{unblinded}</div>

    {#if tx}
      <div>{JSON.stringify(decoded)}</div>
      <div>{JSON.stringify(decoded.vout[vout])}</div>
      <div>
        {JSON.stringify(tx.outs.map((o) => {
            return { a: reverse(o.asset).toString('hex'), v: parseInt(o.value
                  .slice(1)
                  .toString('hex'), 16) };
          }))}
      </div>
    {/if}
  </div>
  <div class="break-all p-8">{asset}</div>

  <div>Balance: {$user.balance}</div>

  <button on:click={liquality}>Connect to liquality</button>
{/if}
