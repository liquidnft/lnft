<script>
  import { Buffer } from "buffer";
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
  import { liquid, electrs } from "$lib/api";
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
    address2,
    unblinded,
    asset,
    txid,
    hash,
    hex,
    psbt,
    ria,
    tx,
    key,
    key2,
    root,
    network,
    seed,
    decoded,
    vout,
    address_receive,
    blindingKeyPair,
    blindingKeyPair2,
    payment,
    payment2,
    payment_out,
    confidentialAddress,
    confidentialAddress2;
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

    return { key: hd, payment, blindingKeyPair };
  };

  let issuance;
  let issue = () => {
    issuance = new Psbt()
      .addInput({
        hash: utxos[0].txid,
        index: utxos[0].vout,
        nonWitnessUtxo: Buffer.from(hex, "hex"),
        sighashType: 1,
        redeemScript: payment.redeem.output,
      })
      // fee
      .addOutput({
        asset: btc,
        nonce: Buffer.alloc(1, 0),
        script: Buffer.alloc(0),
        value: 100000,
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
        script: payment.output,
        value: 99900000,
      })
      .addIssuance({
        assetAmount: 100,
        assetAddress: address,
        tokenAmount: 0,
        precision: 8,
        net: network,
      })
      .signInput(0, ECPair.fromPrivateKey(key.privateKey))
      .finalizeAllInputs();

    hex = issuance.extractTransaction().toHex();
  };

  onMount(async () => {
    network = networks["regtest"];
    seed = mnemonicToSeedSync(generateMnemonic());
    root = fromSeed(seed, network);

    ({ key, payment, blindingKeyPair } = getAddress());
    ({ address, confidentialAddress } = payment);

    ({
      key: key2,
      payment: payment2,
      blindingKeyPair: blindingKeyPair2,
    } = getAddress());
    ({
      address: address2,
      confidentialAddress: confidentialAddress2,
    } = payment2);
  });

  let debug = () => {
    debugger;
  };

  let swap = async () => {
    ({ payment: payment_out, blindingKeyPair } = getAddress());
    ({ address: address_receive } = payment);
    let tx = Transaction.fromHex(hex);
    swapTx = new Psbt()
      .addInput({
        hash: tx.getId(),
        index: 3,
        witnessUtxo: tx.outs[3],
        redeemScript: payment.redeem.output,
      })
      .addOutput({
        asset: btc,
        nonce: Buffer.alloc(1),
        script: payment_out.output,
        value: 1234567,
      })
      .signInput(
        0,
        ECPair.fromPrivateKey(key.privateKey),
        Transaction.ANYONECANPAY & Transaction.SIGHASH_SINGLE
      )
      .finalizeAllInputs();
  };

  let base64 = "cHNldP8BAHcCAAAAAAFPgQZUGQ1bypkTZ3LSUe1STcR179Toj/r7ja3igKqBUQMAAAAA/////wEBJbJRBw4pyhkEPPM8zXMk4t2rA+zErgted8T8Dlz2yVoBAAAAAAAS1ocAF6kUyZFvYuY8HNy5gknJw5OasWyRzECHAAAAAAABAUMB94zhTYE2ms7/5G3CS0cFt62doMNc1ZCQ9FTXjU6XdSIBAAAAAlQL5AAAF6kURMycN3TufYhlCWzQmHQYi37DQo2HAQcXFgAUaKMcnxILZB1ULH4AYo1XbhKRkZwBCGsCRzBEAiAUoIJ8GJo1/WUNUwTWidL04SYFO2UIcS8ts0flBoa8VQIgdvtDHNy5o83LmIl4ypCrTpnSgP8lYV7YXIrODf/dck8BIQICrGoLe2rYijYo6wNOT2zyGoO3//hpvGfIVF+r8pnOjAAA";
  let swapTx = Psbt.fromBase64(base64);
  let addresses;
  let liquality = () => {
    window.bitcoin.enable().then(() => {
      window.bitcoin.request({ method: "wallet_getAddresses" }).then((r) => {
        addresses = r;
      });
    });
  };

  let broadcast = async () => {
    txid = await liquid.url("/broadcast").post({ hex }).text();
  };

  let utxos = [];
  let getUtxos = async (address) => {
    utxos[address] = await electrs.url(`/address/${address}/utxo`).get().json();
    return utxos;
  };

  let getHex = async (txid) => {
    return electrs.url(`/tx/${txid}/hex`).get().text();
  };

  let generate = async (address) => {
    txid = await liquid
      .url(`/generate?address=${address}`)
      .auth(`Bearer ${$token}`)
      .get()
      .text();

    setInterval(() => getUtxos(address), 2000);
  };

  let add = async (utxo) => {
    let hex = await getHex(utxo.txid);
    let tx = Transaction.fromHex(hex);
    swapTx.addInput({
      hash: utxo.txid,
      index: utxo.vout,
      witnessUtxo: tx.outs[utxo.vout],
      redeemScript: payment2.redeem.output,
    });
    base64 = swapTx.toBase64();
  };
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

  <button on:click={debug}>Debug</button>
  <button on:click={() => generate(address)}>Show me the money!</button>
  <button on:click={issue}>Issue asset</button>
  <button on:click={broadcast}>Broadcast</button>
  <button on:click={swap}>Swap</button>

  <!--<QrCode value={address} />-->
  <div class="break-all p-8 stuff">
    <div>Address {address} {confidentialAddress}</div>
    {#if utxos && utxos[address]}
      {#each utxos[address] as utxo}
        <div class="flex">
          <div>{utxo.txid}</div>
          <div>{utxo.value}</div>
          <div>{utxo.asset.slice(0, 6)}</div>
        </div>
      {/each}
    {/if}
    <div>Txid {txid}</div>
    <div>{hex}</div>

    <div>
      {#if psbt}{JSON.stringify(psbt.toBuffer())}{/if}
    </div>
  </div>
  <button on:click={() => generate(address2)}>Show me the money!</button>
  <div class="break-all p-8 stuff">
    <div>Address {address2} {confidentialAddress2}</div>
    {#if utxos && utxos[address2]}
      {#each utxos[address2] as utxo}
        <div
          class="flex w-full justify-center hover:bg-red cursor-pointer"
          on:click={() => add(utxo)}>
          <div class="flex-grow">Txid {utxo.txid}</div>
          <div class="flex-grow">Value {utxo.value}</div>
          <div class="flex-grow">Asset {utxo.asset.slice(0, 6)}</div>
        </div>
      {/each}
    {/if}

    {base64}
  </div>
  <div class="break-all p-8">{asset}</div>

  <div>Balance: {$user.balance}</div>

  <button on:click={liquality}>Connect to liquality</button>
{/if}
