<script>
  import { tick } from "svelte";
  import { page } from "$app/stores";
  import { getArtwork } from "$queries/artworks";
  import { mutation, subscription, operationStore } from "@urql/svelte";
  import { updateArtwork } from "$queries/artworks";
  import { goto } from "$lib/utils";
  import {
    password,
    sighash,
    prompt,
    snack,
    psbt,
    user,
    token,
  } from "$lib/store";
  import { requireLogin, requirePassword } from "$lib/utils";
  import { createSwap, cancelSwap, broadcast } from "$lib/wallet";
  import { formatISO, addDays } from "date-fns";
  import Select from "svelte-select";
  import { btc, units, tickers } from "$lib/utils";
  import SignaturePrompt from "$components/SignaturePrompt";
  import Waiting from "$components/Waiting";

  let { id } = $page.params;
  $: requireLogin($page);

  let artwork, list_price, sats, val, ticker;
  subscription(operationStore(getArtwork(id)), (a, b) => {
    artwork = {
      ...b.artworks_by_pk,
    };

    if (!artwork.asking_asset) artwork.asking_asset = btc;
    if (!artwork.auction_start) artwork.auction_start = formatISO(new Date());
    if (!artwork.auction_end)
      artwork.auction_end = formatISO(addDays(new Date(), 3));

    [sats, val, ticker] = units(artwork.asking_asset);
    list_price = val(artwork.list_price);
  });
  $: if (artwork) [sats, val, ticker] = units(artwork.asking_asset);

  const updateArtwork$ = mutation(updateArtwork);

  const setupSwaps = async () => {
    await requirePassword();

    if (artwork.list_price_tx) {
      try {
        $psbt = await cancelSwap(artwork.asset, 500);
      } catch (e) {
        $snack = e.message;
        return;
      }

      $prompt = SignaturePrompt;
      await new Promise((resolve) =>
        prompt.subscribe((value) => value === "success" && resolve())
      );
      await tick();

      await broadcast($psbt);

      $prompt = Waiting;
      await new Promise((resolve) =>
        prompt.subscribe((value) => value === "success" && resolve())
      );
      await tick();
    }

    try {
      $psbt = await createSwap(
        artwork.asset,
        artwork.asking_asset,
        sats(list_price)
      );
    } catch (e) {
      $snack = e.message;
      return;
    }

    $sighash = 0x83;
    $prompt = SignaturePrompt;
    await new Promise((resolve) =>
      prompt.subscribe((value) => value === "success" && resolve())
    );
    await tick();
    artwork.list_price_tx = $psbt.toBase64();
  };

  let update = async (e) => {
    e.preventDefault();
    if (artwork.managed) setupSwaps();

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
        list_price: sats(list_price),
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

<div class="container mx-auto px-10">
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
            placeholder={val(0)}
            bind:value={list_price} />

          <div class="absolute inset-y-0 right-0 flex items-center mr-2">
            {ticker}
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
</div>