<script>
  import { page } from "$app/stores";
  import { electrs } from "$lib/api";
  import { onMount, tick } from "svelte";
  import { asset, assets, balances, pending, password, user } from "$lib/store";
  import { ProgressLinear } from "$comp";
  import { getArtworks } from "$queries/artworks";
  import { mutation, subscription, operationStore } from "@urql/svelte";
  import reverse from "buffer-reverse";
  import { assetLabel, btc, sats, units, tickers } from "$lib/utils";
  import { requireLogin, requirePassword } from "$lib/auth";
  import { getBalances } from "$lib/wallet";

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
      getBalances();
      loading = false;
    });

  $: [_, val, _] = units($asset);
</script>

{#if loading}
  <div class="absolute top-0 w-full left-0">
    <ProgressLinear />
  </div>
{:else if $balances}
  <div class="w-full xl:w-3/4">
    <div class="mb-5">
      <a class="secondary-color" href="/wallet/asset">{$assets.length}
        assets available in this wallet
        <i class="fas fa-chevron-right ml-3" /></a>
    </div>

    <div class="bg-black mb-2 pt-1 rounded-lg">
      <div
        class="border-l-8 border-green-700 bg-green-100 bg-opacity-10 text-center p-3 text-white text-xl w-1/2 rounded-r-full mt-5">
        {assetLabel($asset)}
      </div>

      <div class="m-6">
        <div class="text-sm text-gray-400">Balance</div>
        <div class="flex gap-2 mt-3">
          <span class="text-4xl text-white">{val($balances[$asset] || 0)}</span>
          <span class="text-gray-400 mt-3.5">{assetLabel($asset)}</span>
        </div>
      </div>
      <div class="m-6">
        <div class="text-sm text-gray-400">Pending</div>
        <div class="flex gap-2 mt-3">
          <span class="text-gray-400">{val($pending[$asset] || 0)}</span>
          <span class="text-gray-400">{assetLabel($asset)}</span>
        </div>
      </div>
      <div class="flex justify-between p-6 pt-2">
        <button
          on:click={() => (funding = !funding)}
          class="button-trans-gray w-full mr-2">Fund</button>
        <button
          on:click={() => (withdrawing = !withdrawing)}
          class="button-trans-gray w-full ml-2">Withdraw</button>
      </div>
    </div>
    <div>
        <Fund bind:funding />
        <Withdraw {val} bind:withdrawing />
      <Transactions />
    </div>
  </div>
{/if}
