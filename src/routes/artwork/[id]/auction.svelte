<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { getArtwork } from "$queries/artworks";
  import { mutation, subscription, operationStore } from "@urql/svelte";
  import { updateArtwork } from "$queries/artworks";
  import { goto } from "$lib/utils";
  import { password, psbt, user, token } from "$lib/store";
  import { requireLogin, requirePassword } from "$lib/utils";
  import { createSwap } from "$lib/wallet";
  import { formatISO, addDays } from "date-fns";
  import Select from "svelte-select";
  import { btc, ticker, tickers } from "$lib/utils";

  let { id } = $page.params;
  $: requireLogin($page);

  let artwork;
  let decimals = 8;
  let precision = 8;
  subscription(operationStore(getArtwork(id)), (a, b) => {
    artwork = {
      ...b.artworks_by_pk,
    };

    list_price = Math.round(artwork.list_price / (10 ** precision));
    if (!artwork.asking_asset) artwork.asking_asset = btc;
    if (!artwork.auction_start) artwork.auction_start = formatISO(new Date());
    if (!artwork.auction_end)
      artwork.auction_end = formatISO(addDays(new Date(), 3));
  });

  $: if (artwork && tickers[artwork.asking_asset]) 
    ({ decimals, precision } = tickers[artwork.asking_asset]);

  const updateArtwork$ = mutation(updateArtwork);
  let list_price;

  let update = async (e) => {
    e.preventDefault();
    await requirePassword();

    $psbt = await createSwap(artwork.asset, artwork.list_price);
    artwork.list_price_tx = $psbt.toBase64();

    let {
      id: artwork_id,
      asking_asset,
      auction_start,
      auction_end,
      description,
      filename,
      reserve_price,
      list_price_tx,
      title,
    } = artwork;

    if (!auction_start) auction_start = null;
    if (!auction_end) auction_end = null;

    updateArtwork$({
      artwork: {
        list_price: list_price * 10 ** precision,
        list_price_tx,
        reserve_price,
        auction_start,
        auction_end,
        asking_asset,
      },
      id,
    }).then(() => {
      goto(`/artwork/${artwork.id}`);
    });
  };
</script>

<h1 class="title">Listing Settings</h1>
<p class="text-xl italic mb-4">All fields are optional</p>

{#if artwork}
  <form class="w-full md:w-1/2 mb-6" on:submit={update} autocomplete="off">
    <div class="flex flex-col mb-4">
      <div>
        <div class="mt-1 relative rounded-md shadow-sm">
          <label>Asset</label>
          <select
            placeholder="Currency"
            bind:value={artwork.asking_asset}
            class="form-input block w-full pl-7 pr-12">
            {#each Object.keys(tickers) as asset}
              <option value={asset}>{tickers[asset].ticker}</option>
            {/each}
          </select>
          <input
            class="form-input block w-full pl-7 pr-12"
            placeholder="0"
            bind:value={artwork.asking_asset} />
        </div>
      </div>
    </div>
    <div class="flex flex-col mb-4">
      <div class="mt-1 relative rounded-md shadow-sm">
        <label>Price</label>
        <input
          class="form-input block w-full pl-7 pr-12"
          placeholder={parseInt(0).toFixed(decimals)}
          bind:value={list_price} />
        {list_price}
        {artwork.list_price}

        <div class="absolute inset-y-0 right-0 flex items-center mr-2">
          {ticker(artwork.asking_asset)}
        </div>
      </div>
    </div>
    <div class="flex flex-col mb-4">
      <label>Auction Start Time</label>
      <input
        placeholder="Auction Start Time"
        bind:value={artwork.auction_start} />
    </div>
    <div class="flex flex-col mb-4">
      <label>Auction End Time</label>
      <input placeholder="Auction End Time" bind:value={artwork.auction_end} />
    </div>
    <div class="flex flex-col mb-4">
      <div>
        <div class="mt-1 relative rounded-md shadow-sm">
          <label>Reserve Price</label>
          <input
            class="form-input block w-full pl-7 pr-12"
            placeholder="0"
            bind:value={artwork.reserve_price} />
        </div>
      </div>
    </div>
    <div class="flex">
      <button
        type="submit"
        class="block bg-green-400 hover:bg-green-dark text-white uppercase text-lg mx-auto p-4 rounded flex-1">Submit</button>
    </div>
  </form>
{/if}
