<script>
  import { page } from "$app/stores";
  import { compareAsc, format, parseISO } from "date-fns";
  import { Activity, Avatar, Card, ProgressLinear } from "$comp";
  import Sidebar from "./_sidebar";
  import { tick } from "svelte";
  import { prompt, password, user, token, psbt } from "$lib/store";
  import countdown from "$lib/countdown";
  import {
    getArtwork,
    getArtworksByArtist,
    destroyArtwork,
  } from "$queries/artworks";
  import {
    createTransaction,
    getArtworkTransactions,
  } from "$queries/transactions";
  import { goto, err, explorer, info, units } from "$lib/utils";
  import { mutation, subscription, operationStore } from "@urql/svelte";
  import { requirePassword } from "$lib/auth";
  import {
    createOffer,
    executeSwap,
    requestSignature,
    sign,
    broadcast,
  } from "$lib/wallet";
  import { Psbt } from "@asoltys/liquidjs-lib";
  import { api } from "$lib/api";

  let { id } = $page.params;

  $: pageChange($page);
  let pageChange = () => api.url("/viewed").post({ id });

  let transactions = [];
  subscription(
    operationStore(getArtworkTransactions(id)),
    (a, b) => (transactions = b.transactions)
  );

  let others = [];
  $: if (artwork)
    subscription(
      operationStore(getArtworksByArtist(artwork.artist_id)),
      (a, b) =>
        (others = b.artworks.filter((a) => artwork && a.id !== artwork.id))
    );

  let artwork, start_counter, end_counter;
  let createTransaction$ = mutation(createTransaction);

  let list_price;
  let val, sats, ticker;
  let amount;

  $: [sats, val, ticker] = units(artwork && artwork.asking_asset);

  $: if (artwork) {
    list_price = artwork.list_price;
    list_price = val(artwork.list_price);
  }

  $: transaction.amount = sats(amount);

  let makeOffer = async (e) => {
    if (e) e.preventDefault();
    await requirePassword();

    try {
      $psbt = await createOffer(artwork, transaction.amount, 500);
    } catch (e) {
      err(e);
      return;
    }

    await sign();
    transaction.psbt = $psbt.toBase64();
    transaction.hash = $psbt.__CACHE.__TX.getId();
    await save();
  };

  let now, timeout;

  subscription(operationStore(getArtwork(id)), (a, b) => {
    artwork = b.artworks_by_pk;

    let count = () => {
      clearTimeout(timeout);
      now = new Date();
      if (!artwork) return;
      start_counter = countdown(parseISO(artwork.auction_start));
      end_counter = countdown(parseISO(artwork.auction_end));
      timeout = setTimeout(count, 1000);
    };
    count();
  });

  let save = async (e) => {
    transaction.artwork_id = artwork.id;
    transaction.asset = artwork.asking_asset;
    await createTransaction$({ transaction });
    if (transaction.type === "purchase") info("Sold! Congratulations!");
    if (transaction.type === "bid") info("Bid placed!");
    bidding = false;
  };

  let bidding, amountInput;
  let startBidding = async () => {
    bidding = true;
    await tick();
    amountInput.focus();
  };

  let transaction = {
    artwork_id: null,
    amount: null,
    type: "bid",
    hash: "",
  };

  let loading;
  let buyNow = async () => {
    try {
      await requirePassword();
      loading = true;

      transaction.amount = -artwork.list_price;
      transaction.type = "purchase";

      $psbt = await executeSwap(artwork, 500);
      await sign();

      if (artwork.royalty || artwork.auction_end) {
        $psbt = await requestSignature($psbt);
      }

      await tick();
      console.log($psbt.toBase64());
      await broadcast($psbt);

      let tx = $psbt.extractTransaction();
      transaction.hash = tx.getId();
      transaction.psbt = $psbt.toBase64();

      await save();

      transaction.amount = artwork.editions;
      transaction.asset = artwork.asset;
      transaction.user
    } catch (e) {
      err(e);
    }

    loading = false;
  };

  let target;
  let destroyArtwork$, destroy;
  $: if (artwork) {
    destroyArtwork$ = mutation(destroyArtwork(artwork));

    destroy = async () => {
      destroyArtwork$().then(() => goto("/market"));
    };
  }

  let showPopup = false;
</script>

<style>
  button {
    @apply mb-2 w-full text-sm;
    &:hover {
      @apply border-green-700;
    }

    &.dangerous {
      &:hover {
        @apply border-red-400;
      }
    }
  }

  span {
    cursor: pointer;
  }

  .popup {
    position: fixed;
    z-index: 100;
    width: 100%;
    height: 100vh;
    padding: 20%;
    text-align: center;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: white;
    scroll-behavior: contain;
    transform: scale(0);
  }

  .showPopup {
    display: flex !important;
    align-items: center;
    justify-content: center;
    animation: zoom 0.2s ease forwards;
  }

  .closeButton {
    position: absolute;
    top: 50px;
    right: 50px;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    background: whitesmoke;
    padding: 8px 10px;
  }

  .mobileImage {
    display: none;
    margin-bottom: 40px;
  }

  .popup :global(video) {
    width: 50%;
    margin: 0 auto;
  }



  .desktopImage :global(img, video) {
    max-height: 70vh;
  }

  @keyframes zoom {
    0% {
      transform: scale(0.6);
    }
    100% {
      transform: scale(1);
    }
  }

  @media only screen and (max-width: 1023px) {
    .desktopImage {
      display: none;
    }

    .mobileImage {
      display: block;
    }

    .closeButton{
      top: 20px;
      right: 20px;
    }
  }
</style>

<div class="container mx-auto mt-10 md:mt-20">
  {#if artwork && !loading}
    <div class="flex justify-between flex-wrap" bind:this={target}>
      <div class="lg:text-left w-full lg:w-1/3 lg:max-w-xs">
        <h1 class="text-3xl font-black primary-color">
          {artwork.title || 'Untitled'}
        </h1>
        <div class="mt-4 mb-6">{artwork.editions} Editions</div>
        <div class="mobileImage">
          <!-- <Card {artwork} link={false} columns={1} showDetails={false} /> -->
          <span on:click={() => (showPopup = !showPopup)}>
            <Card {artwork} link={false} columns={1} showDetails={false} />
          </span>
          <span
            on:click={() => (showPopup = !showPopup)}
            class:showPopup
            class="popup">
            <div class="closeButton"><i class="fas fa-times"></i></div>
            <Card {artwork} link={false} columns={1} showDetails={false} />
          </span>
        </div>
        <Sidebar bind:artwork />

        {#if $user && $user.id === artwork.owner_id}
          <button
            on:click={() => goto(`/artwork/${id}/auction`)}
            class="secondary-btn">List</button>
          <button
            on:click={() => goto(`/artwork/${id}/edit`)}
            class="secondary-btn">Edit</button>
          <button
            on:click={destroy}
            class="dangerous secondary-btn">Destroy</button>
        {:else if artwork.asking_asset}
          {#if artwork.list_price}
            <button on:click={buyNow} class="secondary-btn">Buy Now</button>
          {/if}
          {#if bidding}
            <form on:submit={makeOffer}>
              <div class="flex flex-col mb-4">
                <div>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <input
                      id="price"
                      class="form-input block w-full pl-7"
                      placeholder={val(0)}
                      bind:value={amount}
                      bind:this={amountInput} />
                    <div
                      class="absolute inset-y-0 right-0 flex items-center mr-2">
                      {ticker}
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit" class="secondary-btn">Submit</button>
            </form>
          {:else}
            <button on:click={startBidding} class="secondary-btn">Make an Offer</button>
          {/if}
        {/if}

        <div class="flex justify-between">
          {#if artwork.list_price}
            <div class="my-2">
              <div class="text-sm mt-auto">List Price</div>
              <div class="text-2xl">{list_price} {ticker}</div>
            </div>
          {/if}
          {#if artwork.reserve_price}
            <div class="my-2">
              <div class="text-sm mt-auto">Reserve Price</div>
              <div class="flex-1 text-2xl">
                {artwork.reserve_price}
                {ticker}
              </div>
            </div>
          {/if}
          {#if artwork.bid[0].amount}
            <div class="my-2">
              <div class="text-sm mt-auto">Current bid</div>
              <div class="text-2xl">{val(artwork.bid[0].amount)} {ticker}</div>
            </div>
          {/if}
        </div>

        {#if compareAsc(parseISO(artwork.auction_start), now) === 1}
          <div class="bg-gray-100 px-4 p-1 mt-2 rounded">
            <div class="mt-auto text-sm">Auction starts in</div>
            <div class="mt-1">{start_counter}</div>
          </div>
        {/if}

        {#if compareAsc(parseISO(artwork.auction_end), now) === 1}
          <div class="bg-gray-100 px-4 p-1 mt-2 rounded">
            <div class="mt-auto text-sm">Auction closes in</div>
            <div class="mt-1">{end_counter}</div>
          </div>
        {:else if artwork.auction_end}
          <div class="bg-gray-100 px-4 p-1 mt-2 rounded">
            <div class="mt-auto text-sm">Auction ended at</div>
            <div class="mt-1">{format(parseISO(artwork.auction_end), "yyyy-MM-dd HH:mm")}</div>
          </div>
        {/if}

        <p class="font-bold mt-20">History</p>
        <div class="flex mt-5">
          <div class="w-full">
            {#each transactions as transaction}
              <Activity {transaction} />
            {/each}
          </div>
        </div>
      </div>

      <div class="w-full lg:w-2/3 lg:px-12">
        <div class="desktopImage">
          <span on:click={() => (showPopup = !showPopup)}>
            <Card {artwork} link={false} columns={1} showDetails={false} />
          </span>
          <span
            on:click={() => (showPopup = !showPopup)}
            class:showPopup
            class="popup">
            <div class="closeButton"><i class="fas fa-times"></i></div>
            <Card {artwork} link={false} columns={1} showDetails={false} />
          </span>
        </div>
        <div class="w-full mt-28">
          <h2 class="text-2xl font-bold primary-color py-10 px-0 md:px-5">
            More by this artist
          </h2>
          <div class="w-full flex flex-wrap">
            {#each others as artwork (artwork.id)}
              <div class="w-full lg:w-full xl:w-1/2 px-0 md:px-5 mb-20">
                <Card {artwork} />
              </div>
            {:else}
              <div class="mx-auto">No other artworks</div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  {:else}
    <ProgressLinear app={true} />
  {/if}
</div>
