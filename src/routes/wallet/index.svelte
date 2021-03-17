<script>
  import { border, bg } from "./_colors";
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
    return tickers[a] ? tickers[a].name : assetLabel(a)
  };

  let ticker = (a) => {
    let artwork = artworks.find((aw) => aw.a === a);
    if (artwork) return artwork.title;
    return tickers[a] ? tickers[a].ticker : a.substr(0, 5);
  };

  let funding;
  let withdrawing;

  let toggleFunding = () => {
    funding = !funding;
    withdrawing = false;
  };

  let toggleWithdrawing = () => {
    withdrawing = !withdrawing;
    funding = false;
  };

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

<style>
  .dark-red { background: #2b0208; } 
  .dark-green { background: #082527; }
  .dark-gray { background: #31373e; }
  .border-blue { border-color: #6ed8e0; }

  .bg-btc { background: #3e6d79; } 
  .border-btc { border-color: #30bfad; } 

  .active {
    @apply border-t-2 border-b-2 border-r-2 text-white;
  } 

  button:disabled {
    @apply text-gray-400 border-gray-400;
  } 
</style>

{#if loading}
  <div class="absolute top-0 w-full left-0">
    <ProgressLinear />
  </div>
{:else if $balances}
  <div class="w-full xl:w-3/4 max-w-lg">
    {#if $assets.length}
      <div class="mb-5">
        <a class="secondary-color" href="/wallet/asset">{$assets.length}
          assets available in this wallet
          <i class="fas fa-chevron-right ml-3" /></a>
      </div>
    {/if}

    <div class="bg-black mb-2 pt-1 rounded-lg">
      <div
        class={`border-l-8 text-center p-3 text-white text-xl w-1/2 rounded-r-full mt-5 ${border($asset)} ${bg($asset)}`}>
        {name($asset)}
      </div>

      <div class="m-6">
        <div class="text-sm text-gray-400">Balance</div>
        <div class="flex mt-3">
          <span class="text-4xl text-white mr-3">{val($balances[$asset] || 0)}</span>
          <span class="text-gray-400 mt-3.5">{assetLabel($asset)}</span>
        </div>
      </div>
      <div class="m-6">
        <div class="text-sm text-gray-400">Pending</div>
        <div class="flex mt-3">
          <span class="text-gray-400 mr-3">{val($pending[$asset] || 0)}</span>
          <span class="text-gray-400">{assetLabel($asset)}</span>
        </div>
      </div>
      <div class="flex justify-between p-6 pt-2">
        <button
          on:click={toggleFunding}
          class="button-trans-gray w-full mr-2">Fund</button>
        <button
          on:click={toggleWithdrawing}
          class="button-trans-gray w-full ml-2" disabled={!$balances[$asset]}>Withdraw</button>
      </div>
    </div>
    <div>
      <Fund bind:funding />
      <Withdraw bind:withdrawing />
      <Transactions />
    </div>
  </div>
{/if}
