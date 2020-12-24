<script>
  import { liquid, electrs } from "$lib/api";
  // import QrCode from "svelte-qrcode";
  import { onMount } from "svelte";
  import { user, token } from "$lib/store";
  import getAddress from "$lib/getAddress";
  import { mutation, subscription, operationStore } from "@urql/svelte";
  import reverse from "buffer-reverse";

  let loading = true;
  let locked = true;
  let address;
  let password = "liquidart";
  let unlock = async () => {
    ({ address } = getAddress($user.mnemonic, password));

    await getUtxos(address);
    loading = false;

    setInterval(() => getUtxos(address), 2000);
    locked = false;
  };

  let utxos = [];
  let getUtxos = async (address) => {
    utxos = await electrs.url(`/address/${address}/utxo`).get().json();
    loading = false;
  };

  let balances;
  $: {
    balances = {};
    utxos.map((u) => {
      if (balances[u.asset]) balances[u.asset] += u.value;
      else balances[u.asset] = u.value;
    });
  }

  let generate = async () => {
    loading = true;
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
    <div>Address: {address}</div>
    <div>
      Balance:
      {#if loading}
        Loading...
      {:else}
        {#each Object.keys(balances) as asset}
          <div>{asset}: {balances[asset]}</div>
        {/each}
      {/if}
    </div>
    <button on:click={generate}>Faucet</button>
  {/if}
{/if}
