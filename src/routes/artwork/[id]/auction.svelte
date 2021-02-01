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
  import { createTransaction } from "$queries/transactions";
  import {
    createSwap,
    cancelSwap,
    broadcast,
    sendToMultisig,
  } from "$lib/wallet";
  import { formatISO, addDays } from "date-fns";
  import Select from "svelte-select";
  import { btc, units, tickers } from "$lib/utils";
  import SignaturePrompt from "$components/SignaturePrompt";
  import Waiting from "$components/Waiting";

  let { id } = $page.params;
  $: requireLogin($page);

  let input;
  let initialized;
  let focus = (i) => i && tick().then(() => input.focus());
  $: focus(initialized);

  let artwork, list_price, sats, val, ticker, royalty;
  subscription(operationStore(getArtwork(id)), (a, b) => {
    artwork = {
      ...b.artworks_by_pk,
    };

    if (!artwork.asking_asset) artwork.asking_asset = btc;
    if (!artwork.auction_start) artwork.auction_start = formatISO(new Date());
    if (!artwork.auction_end)
      artwork.auction_end = formatISO(addDays(new Date(), 3));

    [sats, val, ticker] = units(artwork.asking_asset);
    if (!list_price) list_price = val(artwork.list_price);
    if (!royalty) royalty = artwork.royalty;
    initialized = true;
  });
  $: if (artwork) [sats, val, ticker] = units(artwork.asking_asset);

  const updateArtwork$ = mutation(updateArtwork);

  const spendPreviousSwap = async () => {
    if (
      !(royalty && !artwork.royalty) &&
      parseInt(artwork.list_price || 0) === sats(list_price)
    )
      return true;

    if (artwork.list_price_tx) {
      try {
        $psbt = await cancelSwap(artwork, 500);
      } catch (e) {
        $snack = e.message;
        console.log(e.stack);
        return false;
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

    return true;
  };

  const setupSwaps = async () => {
    if (parseInt(artwork.list_price || 0) === sats(list_price)) return true;
    await requirePassword();

    try {
      $psbt = await createSwap(artwork, sats(list_price));
    } catch (e) {
      $snack = e.message;
      console.log(e.stack);
      return;
    }

    $sighash = 0x83;
    $prompt = SignaturePrompt;
    await new Promise((resolve) =>
      prompt.subscribe((value) => value === "success" && resolve())
    );
    await tick();
    artwork.list_price_tx = $psbt.toBase64();

    return true;
  };

  let createTransaction$ = mutation(createTransaction);
  let setupRoyalty = async () => {
    if (artwork.royalty || !royalty) return true;

    artwork.royalty = royalty;
    await requirePassword();
    try {
      $psbt = await sendToMultisig(artwork, 10000);

      $prompt = SignaturePrompt;
      await new Promise((resolve) =>
        prompt.subscribe((value) => value === "success" && resolve())
      );
      await tick();

      await broadcast($psbt);

      createTransaction$({
        transaction: {
          amount: artwork.editions,
          artwork_id: artwork.id,
          asset: artwork.asking_asset,
          hash: $psbt.extractTransaction().getId(),
          psbt: $psbt.toBase64(),
          type: "royalty",
        },
      }).then(() => {
        $snack = "Royalties activated!";
      });

      return true;
    } catch (e) {
      $snack = e.message;
      return false;
    }
  };

  let update = async (e) => {
    e.preventDefault();

    if (!(await spendPreviousSwap())) return;
    if (!(await setupRoyalty())) return;
    if (!(await setupSwaps())) return;

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
      bid_increment,
      max_extensions,
      extension_interval,
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
        bid_increment,
        max_extensions,
        extension_interval,
        royalty,
      },
      id,
    }).then(() => {
      goto(`/artwork/${artwork.id}`);
    });
  };
</script>

<style>
  input, select, textarea{ 
    @apply rounded-lg mb-4;
  }

  label{
    @apply mb-2;
  }
</style>

<div class="container mx-auto px-8">
  <div class="w-full xl:w-1/3 mx-auto">
  <h1 class="primary-color title">Listing Settings</h1>
  <p class="text-xl italic my-4">All fields are optional</p>
  
  {#if artwork}
    <form class="w-full mb-6" on:submit={update} autocomplete="off">
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
          <label>Listing Price ("Buy it Now")</label>
          <input
            class="form-input block w-full pl-7 pr-12"
            placeholder={val(0)}
            bind:value={list_price}
            bind:this={input} />

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
        <input
          placeholder="Auction End Time"
          bind:value={artwork.auction_end} />
      </div>
      <div class="flex flex-col mb-4">
        <div>
          <div class="mt-1 relative rounded-md shadow-sm">
            <label>Reserve Price (Minimum Accepted Offer)</label>
            <input
              class="form-input block w-full pl-7 pr-12"
              placeholder="0"
              bind:value={artwork.reserve_price} />
          </div>
        </div>
      </div>
      <div class="flex flex-col mb-4">
        <div>
          <div class="mt-1 relative rounded-md shadow-sm">
            <label>Bid Increment (Bids must be higher than previous bid)</label>
            <input
              class="form-input block w-full pl-7 pr-12"
              placeholder="0"
              bind:value={artwork.bid_increment} />
          </div>
        </div>
      </div>
      <div class="flex flex-col mb-4">
        <div>
          <div class="mt-1 relative rounded-md shadow-sm">
            <label>Extension Interval (Auction end time gets extended if bid
              received within this interval)</label>
            <input
              class="form-input block w-full pl-7 pr-12"
              placeholder="0"
              bind:value={artwork.extension_interval} />
          </div>
        </div>
      </div>
      <div class="flex flex-col mb-4">
        <div>
          <div class="mt-1 relative rounded-md shadow-sm">
            <label>Max Extensions (Number of times the auction can be extended)</label>
            <input
              class="form-input block w-full pl-7 pr-12"
              placeholder="0"
              bind:value={artwork.max_extensions} />
          </div>
        </div>
      </div>
      <div class="flex flex-col mb-4">
        <div>
          <div class="mt-1 relative rounded-md shadow-sm">
            <label>Royalty Rate (Percentage paid to artist of every sale)</label>
            <input
              class="form-input block w-full pl-7 pr-12"
              placeholder="0"
              bind:value={royalty} />
          </div>
        </div>
      </div>
      <div class="flex">
        <button
          type="submit"
          class="brand-color">Submit</button>
      </div>
    </form>
  {/if}
  </div>
</div>
