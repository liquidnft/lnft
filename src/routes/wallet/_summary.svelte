<script>
  import { page } from "$app/stores";
  import { electrs } from "$lib/api";
  import { onMount, tick } from "svelte";
  import { asset, poll, snack, password, user, token, prompt, psbt } from "$lib/store";
  import { ProgressLinear } from "$comp";
  import { getArtworks } from "$queries/artworks";
  import { mutation, subscription, operationStore } from "@urql/svelte";
  import reverse from "buffer-reverse";
  import {
    btc,
    sats,
    units,
    tickers,
    requireLogin,
    requirePassword,
  } from "$lib/utils";
  import { unblind } from "$lib/wallet";
  import Fund from "./_fund";
  import Withdraw from "./_withdraw";
  import Transactions from "./_transactions";

  $: requireLogin($page);

  let loading = true;
  if (!$asset) $asset = btc;
  let name = (a) => {
    let artwork = artworks.find((aw) => aw.a === a);
    if (artwork) return artwork.title;
    return tickers[a] ? tickers[a].name : a.substr(0, 12);
  };

  let ticker = (a) => {
    let artwork = artworks.find((aw) => aw.a === a);
    if (artwork) return artwork.title;
    return tickers[a] ? tickers[a].ticker : a.substr(0, 5);
  };

  let funding = false;
  let withdrawing = false;

  let artworks = [];
  $: if ($user)
    subscription(operationStore(getArtworks), async (_, data) => {
      await new Promise((resolve) =>
        user.subscribe((value) => value && resolve())
      );
      artworks = data.artworks.filter((a) => a.owner_id === $user.id);
      if ($user.address) getUtxos($user.address);
    });

  $: [_, val, _] = units($asset);

  let init = async () => {
    $poll = setInterval(() => getUtxos($user.address), 5000);
  };

  $: if ($user && loading) init();

  let utxos = [];
  let assets = [];
  let unblinded = {};

  let getUtxos = async (address) => {
    utxos = await electrs.url(`/address/${address}/utxo`).get().json();
    await requirePassword();

    for (let i = 0; i < utxos.length; i++) {
      if (utxos[i].asset) break;
      let { txid, vout } = utxos[i];
      if (!unblinded[txid]) {
        let hex = await electrs.url(`/tx/${txid}/hex`).get().text();
        unblinded[txid] = unblind(hex, vout);
      }
      utxos[i] = unblinded[txid];
    }

    assets = utxos
      .map(({ asset: a }) => ({ name: name(a), asset: a }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .sort((a, b) => (a.name.length === 12 ? 1 : -1))
      .filter(
        (item, pos, ary) =>
          item &&
          item.asset !== btc &&
          (!pos || item.asset != ary[pos - 1].asset)
      );

    loading = false;
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
    <a class="secondary-color" href="/wallet/asset">{assets.length} assets available in this
      wallet &gt;</a>
  </div>

  <div class="dark mb-2">
    {name($asset)}

    <div class="mb-2">
      <div class="text-sm text-gray-600">Balance</div>
      {val(balances[$asset] || 0)}
      {ticker($asset)}
    </div>
    <div class="mb-2">
      <div class="text-sm text-gray-600">Pending</div>
      {val(pending[$asset] || 0)}
      {ticker($asset)}
    </div>

    <button on:click={() => (funding = !funding)}>Fund</button>
    <button on:click={() => (withdrawing = !withdrawing)}>Withdraw</button>
  </div>
  <div>
    {#if funding}
      <Fund />
    {/if}

    {#if withdrawing}
      <Withdraw {val} />
    {/if}

    <Transactions asset={ticker($asset)} />
  </div>
{/if}
