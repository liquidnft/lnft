<script>
  import { electrs } from "$lib/api";
  // import QrCode from "svelte-qrcode";
  import { onMount, tick } from "svelte";
  import { poll, snack, password, user, token, prompt, psbt } from "$lib/store";
  import { ProgressLinear, SignaturePrompt } from "$comp";
  import getAddress from "$lib/getAddress";
  import { getArtworks } from "$queries/artworks";
  import { mutation, subscription, operationStore } from "@urql/svelte";
  import reverse from "buffer-reverse";
  import { tickers, requireLogin, requirePassword } from "$lib/utils";
  import { broadcast, pay, sign } from "$lib/wallet";

  const btc =
    "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225";

  let loading = true;
  let sending = false;
  let address, amount, fee, to;
  let asset = btc;
  let name = (asset) => {
    let artwork = artworks.find((a) => a.asset === asset);
    if (artwork) return artwork.title;
    return tickers[asset] ? tickers[asset] : asset.substr(0, 12);
  };

  let artworks = [];
  subscription(operationStore(getArtworks), (_, data) => {
    artworks = data.artworks.filter((a) => a.owner_id === $user.id);
    if (address) getUtxos(address);
  });

  onMount(requireLogin);

  let init = async () => {
    await requirePassword();

    try {
      ({ address } = getAddress($user.mnemonic, $password));
    } catch (e) {
      $snack = "Failed to decrypt wallet";
    }

    $poll = setInterval(() => getUtxos(address), 2000);
  };

  $: if ($user && loading) init();

  let utxos = [];
  let assets = [];
  let getUtxos = async (address) => {
    utxos = await electrs.url(`/address/${address}/utxo`).get().json();
    if (!assets.length) {
      assets = utxos
        .map(({ asset }) => ({ name: name(asset), asset }))
        .sort((a, b) => a.name.localeCompare(b.name))
        .sort((a, b) => (a.name.length === 12 ? 1 : -1))
        .filter((item, pos, ary) => !pos || item.asset != ary[pos - 1].asset);
      loading = false;
    }
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

  let send = async (e) => {
    e.preventDefault();
    $psbt = await pay(asset, to, amount, fee);
    $prompt = SignaturePrompt;
    await new Promise((resolve) =>
      prompt.subscribe((value) => value || resolve())
    );
    await tick();
    await broadcast($psbt);
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
  <div class="absolute top-0 w-full left-0">
    <ProgressLinear />
  </div>
{:else}
  <div class="mb-2">
    <div class="text-sm text-gray-600">Address</div>
    {address}
  </div>
  <div class="mb-2">
    <div class="text-sm text-gray-600">Balance</div>
    {balances[asset] || 0}
  </div>
  <div class="mb-2">
    <div class="text-sm text-gray-600">Pending</div>
    {pending[asset] || 0}
  </div>

  {#if sending}
    <form class="w-full md:w-1/2 mb-6" on:submit={send} autocomplete="off">
      <div class="flex flex-col mb-4">
        <select bind:value={asset}>
          {#each assets as asset}
            <option value={asset.asset}>{asset.name}</option>
          {/each}
        </select>
      </div>
      <div class="flex flex-col mb-4">
        <input placeholder="Amount" bind:value={amount} autofocus />
      </div>
      <div class="flex flex-col mb-4">
        <input placeholder="Fee" bind:value={fee} />
      </div>
      <div class="flex flex-col mb-4">
        <input placeholder="Address" bind:value={to} />
      </div>
      <button type="submit">Send</button>
    </form>
  {:else}<button on:click={() => (sending = true)}>Withdraw</button>{/if}
{/if}
