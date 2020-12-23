<script>
  import { Buffer } from "buffer";
  import cryptojs from "crypto-js";
  import { mnemonicToSeedSync } from "bip39";
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

  let loading = true;
  let locked = true;
  let address;
  let password = "liquidart";
  let unlock = async () => {
    let {
      AES: aes,
      enc: { Utf8 },
    } = cryptojs;

    let network = networks["regtest"];
    console.log($user.mnemonic, password);
    let mnemonic = aes.decrypt($user.mnemonic, password).toString(Utf8);
    let seed = mnemonicToSeedSync(mnemonic);
    let root = fromSeed(seed, network);
    let hd = root.derive(0);

    let p2wpkh = payments.p2wpkh({
      pubkey: hd.publicKey,
      network,
    });

    const nodeBlinding = slip77FromSeed(seed);
    const blindingKeyPair = nodeBlinding.derive(p2wpkh.output);
    ({ address }= payments.p2sh({
      redeem: { output: p2wpkh.output },
      network,
      pubkey: hd.publicKey,
      // blindkey: blindingKeyPair.publicKey,
    }));

    await getUtxos(address);
    loading = false;

    setInterval(() => getUtxos(address), 2000);
    locked = false;
  };

  let utxos = [];
  let getUtxos = async (address) => {
    utxos = await electrs.url(`/address/${address}/utxo`).get().json();
  };

  $: balance = utxos.reduce((a, b) => (a + b.value), 0);

  let generate = async () => {
    await liquid
      .url(`/generate?address=${address}`)
      .auth(`Bearer ${$token}`)
      .get()
      .text();
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
  {#if locked}
  <input bind:value={password} placeholder="Password" />
  <button on:click={unlock}>Unlock</button>
{:else}
  {#if loading}
    Loading...
  {:else}
{/if}
  <div>Address: {address}</div>
  <div>Balance: {balance}</div>
  <button on:click={generate}>Faucet</button>
{/if}
{/if}
