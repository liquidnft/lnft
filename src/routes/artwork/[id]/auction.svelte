<script>
  import { tick } from "svelte";
  import { page } from "$app/stores";
  import { getArtwork } from "$queries/artworks";
  import { mutation, subscription, operationStore } from "@urql/svelte";
  import { updateArtwork } from "$queries/artworks";
  import { password, sighash, prompt, psbt, user, token } from "$lib/store";
  import { requireLogin, requirePassword } from "$lib/auth";
  import { createTransaction } from "$queries/transactions";
  import {
    createSwap,
    cancelSwap,
    sign,
    signAndBroadcast,
    sendToMultisig,
  } from "$lib/wallet";
  import { formatISO, addDays } from "date-fns";
  import { btc, goto, err, info, units, tickers } from "$lib/utils";
  import ProgressLinear from "$components/ProgressLinear";
  import Select from "svelte-select";

  let { id } = $page.params;
  $: requireLogin($page);

  let input;
  let initialized;
  let focus = (i) => i && tick().then(() => input.focus());
  $: focus(initialized);

  let loading = true;
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
    loading = false;
  });
  $: if (artwork) [sats, val, ticker] = units(artwork.asking_asset);

  const updateArtwork$ = mutation(updateArtwork);

  const spendPreviousSwap = async () => {
    if (royalty || parseInt(artwork.list_price || 0) === sats(list_price))
      return true;

    await requirePassword();

    if (artwork.list_price_tx) {
      $psbt = await cancelSwap(artwork, 500);

      await signAndBroadcast();
    }
  };

  const setupSwaps = async () => {
    if (parseInt(artwork.list_price || 0) === sats(list_price)) return true;
    await requirePassword();

    $psbt = await createSwap(artwork, sats(list_price));

    await sign(0x83);
    artwork.list_price_tx = $psbt.toBase64();

    await createTransaction$({
      transaction: {
        amount: sats(list_price),
        artwork_id: artwork.id,
        asset: artwork.asking_asset,
        hash: $psbt.__CACHE.__TX.getId(),
        psbt: $psbt.toBase64(),
        type: "listing",
      },
    });

    info("List price updated!");
  };

  let createTransaction$ = mutation(createTransaction);
  let setupRoyalty = async () => {
    if (artwork.royalty || !royalty) return true;

    artwork.royalty = royalty;
    await requirePassword();

    $psbt = await sendToMultisig(artwork, 10000);

    await signAndBroadcast();

    await createTransaction$({
      transaction: {
        amount: artwork.editions,
        artwork_id: artwork.id,
        asset: artwork.asking_asset,
        hash: $psbt.extractTransaction().getId(),
        psbt: $psbt.toBase64(),
        type: "royalty",
      },
    });

    info("Royalties activated!");
  };

  let update = async (e) => {
    loading = true;

    try {
      e.preventDefault();

      await spendPreviousSwap();
      await setupRoyalty();
      await setupSwaps();

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

      await updateArtwork$({
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
      });
      goto(`/artwork/${artwork.id}`);
    } catch (e) {
      err(e);
    }
    loading = false;
  };

  let yes = false;
</script>

<style>
  .container {
    background-color: #ecf6f7;
    width: 100% !important;
    margin: 0;
    max-width: 100%;
  }

  input,
  select,
  textarea {
    @apply rounded-lg mb-4;
  }

  label {
    @apply mb-2;
  }
  .tooltip {
    cursor: pointer;
  }
  .tooltip .tooltip-text {
    visibility: hidden;
    padding: 15px;
    position: absolute;
    z-index: 100;
    width: 300px;
    font-style: normal;
  }
  .tooltip:hover .tooltip-text {
    visibility: visible;
  }

  input[type="checkbox"]:checked {
    appearance: none;
    border: 5px solid #fff;
    outline: 2px solid #6ed8e0;
    background-color: #6ed8e0;
    padding: 2px;
    border-radius: 0;
  }

  input[type="radio"]:checked {
    appearance: none;
    border: 7px solid #6ed8e0;
    background-color: #fff;
    padding: 2px;
    border-radius: 100%;
  }

  @media only screen and (max-width: 768px) {
    .container {
      background: none;
    }
  }
</style>

<div class="container mx-auto md:p-20">
  <div class="w-full xl:w-1/2 mx-auto bg-white md:p-10 rounded-xl">
    <a class="block mb-6 text-midblue" href="/"><i
        class="fas fa-chevron-left mr-3" />Back</a>
    <h2>List artwork</h2>

    {#if !loading}
      <p class="text-xl italic my-10">All fields are optional</p>
      <form class="w-full mb-6" on:submit={update} autocomplete="off">
        <div class="flex flex-col mb-4">
          <div>
            <div class="mt-1 relative rounded-md shadow-sm">
              <p>Asset</p>
              <div class="flex mt-4">
                {#each Object.keys(tickers) as asset}
                  <label class="ml-2 mr-6 flex items-center">
                    <input
                      class="form-radio h-6 w-6 mt-4 mr-2"
                      type="radio"
                      name={asset}
                      value={asset} />
                    {tickers[asset].ticker}
                  </label>
                {/each}
              </div>
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
          <div class="mt-1 relative w-1/2 xl:w-1/3 rounded-md shadow-sm">
            <label>Price
              <input
                class="form-input block w-full pl-7 pr-12"
                placeholder={val(0)}
                bind:value={list_price}
                bind:this={input} />
            </label>
            <div class="absolute inset-y-0 right-0 flex items-center mr-2 mt-2">
              {ticker}
            </div>
          </div>
        </div>
        {#if $user.id === artwork.artist_id}
          <div class="flex flex-col mb-4">
            <div>
              <div class="mt-1 relative w-1/2 xl:w-1/3 rounded-md shadow-sm">
                <label>Royalty Rate</label>
                <input
                  class="form-input block w-full pl-7 pr-12"
                  placeholder="0"
                  bind:value={royalty} />
              </div>
            </div>
          </div>
        {/if}
        <div class="auction-toggle">
          <label class="inline-flex items-center">
            <input
              class="form-checkbox h-6 w-6 mt-3"
              type="checkbox"
              bind:checked={yes} />
            <span class="ml-3 text-xl">Create an auction</span>
          </label>
        </div>
        {#if yes}
          <div class="aution-container">
            <p class="italic my-8">
              By leaving the following fields empty, your auction will be set to
              the default settings.
              <span class="tooltip">
                <i
                  class="far fa-question-circle ml-3 text-midblue text-xl tooltip" />
                <span class="tooltip-text bg-gray-100 shadow ml-4 rounded">
                  Auction default settings:
                  <br />By default, your auction will start as soon as it's set
                  and will last for 3 days
                </span>
              </span>
            </p>
            <div class="flex auction justify-between flex-wrap">
              <div class="flex flex-col">
                <h4 class="mb-4">Auction start</h4>
                <div class="flex justify-between">
                  <div class="flex flex-col mb-4 mr-6">
                    <label for="date">Date</label>
                    <input type="date" name="date" />
                  </div>
                  <div class="flex flex-col mb-4">
                    <label for="time">Time</label>
                    <input type="time" name="time" />
                  </div>
                </div>
              </div>
              <div class="flex flex-col">
                <h4 class="mb-4">Auction end</h4>
                <div class="flex justify-between">
                  <div class="flex flex-col mb-4 mr-6">
                    <label for="date">Date</label>
                    <input type="date" name="date" />
                  </div>
                  <div class="flex flex-col mb-4">
                    <label for="time">Time</label>
                    <input type="time" name="time" />
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col mb-4">
              <div>
                <div class="mt-1 relative w-1/2 xl:w-1/3 rounded-md shadow-sm">
                  <label>Reserve price
                    <span class="tooltip">
                      <i
                        class="far fa-question-circle ml-3 text-midblue text-xl tooltip" />
                      <span
                        class="tooltip-text bg-gray-100 shadow ml-4 rounded">
                        Reserve price is the minimum price that you'll accept
                        for the artwork. Setting one is optional.
                      </span>
                    </span>
                    <input
                      class="form-input block w-full pl-7 pr-12"
                      placeholder="0"
                      bind:value={artwork.reserve_price} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        {/if}
        <div class="flex mt-10">
          <button type="submit" class="primary-btn">Submit</button>
        </div>
      </form>
    {:else}
      <ProgressLinear />
    {/if}
  </div>
</div>
