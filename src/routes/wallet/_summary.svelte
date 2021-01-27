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


{#if loading}
  <div class="absolute top-0 w-full left-0">
    <ProgressLinear />
  </div>
{:else}
  <div class="w-3/4">
    <div class="mb-5">
      <a class="secondary-color" href="/wallet/asset">{assets.length} assets available in this
        wallet <i class="fas fa-chevron-right ml-3"></i></a>
    </div>

    <div class="bg-black mb-2 pt-1 rounded-lg">
      <div class="brand-color text-center p-3 text-black text-xl font-bold w-1/2 rounded-r-full mt-5">{name($asset)}</div>

      <div class="m-6">
        <div class="text-sm text-gray-400">Balance</div>
        <div class="flex gap-2 mt-3">
          <span class="text-4xl text-white">{val(balances[$asset] || 0)}</span>
          <span class="text-gray-400 mt-3.5">{ticker($asset)}</span>
        </div>
      </div>
      <div class="m-6">
        <div class="text-sm text-gray-400">Pending</div>
        <div class="flex gap-2 mt-3">
          <span class="text-gray-400">{val(pending[$asset] || 0)}</span>
          <span class="text-gray-400">{ticker($asset)}</span>
        </div>
      </div>
      <div class="flex gap-10 p-6 pt-2">
        <button on:click={() => (funding = !funding)} class="button-trans-gray w-full">Fund</button>
        <button on:click={() => (withdrawing = !withdrawing)} class="button-trans-gray w-full">Withdraw</button>
      </div>
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
  </div>
{/if}
