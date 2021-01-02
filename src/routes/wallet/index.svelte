<script>
  import { electrs } from "$lib/api";
  // import QrCode from "svelte-qrcode";
  import { onMount } from "svelte";
  import { snack, password, user, token } from "$lib/store";
  import getAddress from "$lib/getAddress";
  import { mutation, subscription, operationStore } from "@urql/svelte";
  import reverse from "buffer-reverse";
  import { requireLogin, requirePassword } from "$lib/utils";
  import { broadcast, pay, sign } from "$lib/wallet";

  const btc =
    "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225";

  let loading = true;
  let address;
  let amount = 123;
  let fee = 100000;
  let to = "XShxPnuCJJvPQghYjPSzsg45dLnrpSTPuT";
  onMount(requireLogin);

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
  };

  let balances, pending;
  $: {
    balances = {};
    pending = {};
    utxos.map((u) => {
      if (u.status.confirmed) {
        if (balances[u.asset]) balances[u.asset] += u.value;
        else balances[u.asset] = u.value;
      } else {
        if (pending[u.asset]) pending[u.asset] += u.value;
        else pending[u.asset] = u.value;
      }
    });
  }

  let psbt;
  let send = async (e) => {
    e.preventDefault();
    psbt = await pay(to, amount, fee);
  };

  let signAndBroadcast = () => {
    psbt = sign(psbt);
    broadcast(psbt);
    psbt = undefined;
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

{#if loading}
  Loading...
{:else}
  <div class="mb-2"><span class="font-bold">Address:</span> {address}</div>
  <div class="mb-2">
    <span class="font-bold">Balance:</span>
    {balances[btc] || 0}
  </div>
  <div class="mb-2">
    <span class="font-bold">Pending:</span>
    {pending[btc] || 0}
  </div>

  {#if psbt}
    <div class="break-all">{psbt.toBase64()}</div>
    <button on:click={signAndBroadcast}>Sign and Broadcast</button>
  {:else}
    <form on:submit={send}>
      <h2 class="text-xl">Withdraw</h2>
      <div><input placeholder="Amount" bind:value={amount} autofocus /></div>
      <div><input placeholder="Fee" bind:value={fee} autofocus /></div>
      <div><input placeholder="Address" bind:value={to} /></div>
      <button type="submit">Send</button>
    </form>
  {/if}
{/if}
