<script>
  import bitcoin from '$lib/liquidjs-lib';
  import { liquid } from "$lib/api";
  // import QrCode from "svelte-qrcode";
  import { onMount } from "svelte";
  import { user, token } from "$lib/store";
  import { mutation, subscription, operationStore } from "@urql/svelte";

  let createAddress = {
    query: `mutation create_address($address: address_insert_input!) {
    insert_addresses_one(object: $address) {
      id,
      user_id
    } 
  }`,
  };

  let address, btcaddress;
  onMount(async () => {

    address = await liquid
      .url("/address")
      .auth(`Bearer ${$token}`)
      .get()
      .text();

      btcaddress = bitcoin.payments.p2wpkh({
        pubkey: bitcoin.ECPair.makeRandom().publicKey,
        network: bitcoin.networks['liquid']
      }).address;
  });

  let addresses;
  let liquality = () => {
    window.bitcoin.enable().then(() => {

    window.bitcoin.request({ method: "wallet_getAddresses" }).then((r) => {
      addresses = r;
    });
    });
  };
</script>

<style>
  button {
    @apply border border-black w-full uppercase text-sm font-bold py-2 px-4 rounded my-4;
  }
</style>

{#if $user}
  <h1 class="title">Wallet</h1>

  <!--<QrCode value={address} />-->
  {btcaddress}

  <div>Balance: {$user.balance}</div>

  <button on:click={liquality}>Connect to liquality</button>
  {JSON.stringify(addresses)}
{/if}
