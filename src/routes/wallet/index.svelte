<script>
  import { electrs } from "$lib/api";
  // import QrCode from "svelte-qrcode";
  import { onMount } from "svelte";
  import { snack, password, user, token } from "$lib/store";
  import getAddress from "$lib/getAddress";
  import { mutation, subscription, operationStore } from "@urql/svelte";
  import reverse from "buffer-reverse";
  import { requireLogin, requirePassword } from "$lib/utils";

  let loading = true;
  let address;
  requireLogin();

  let init = async () => {
    await requirePassword();

    try {
      ({ address } = getAddress($user.mnemonic, $password));
    } catch (e) {
      $snack = "Failed to decrypt wallet";
    }

    await getUtxos(address);
    loading = false;

    setInterval(() => getUtxos(address), 2000);
  };

  $: if ($user && loading) init();

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

{#if loading}
  Loading...
{:else}
  <div class="font-bold mb-2">Address: {address}</div>
  <div>
    <h2>Assets</h2>
    {#each Object.keys(balances).sort() as asset}
      <div>{asset}: {balances[asset]}</div>
    {/each}
  </div>
  <button on:click={generate}>Faucet</button>
{/if}
