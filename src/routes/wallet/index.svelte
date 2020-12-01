<script>
  import { onMount } from "svelte";
  import { liquid } from "$lib/api";
  import QrCode from "svelte-qrcode";
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

  let address;
  onMount(async () => {
    address = await liquid
      .url("/address")
      .auth(`Bearer ${$token}`)
      .get()
      .text();
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

  <QrCode value={address} />
  {address}

  <div>Balance: {$user.balance}</div>

  <button on:click={liquality}>Connect to liquality</button>
  {JSON.stringify(addresses)}
{/if}
