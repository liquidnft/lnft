<script>
  import Fa from "svelte-fa";
  import {
    faChevronDown,
    faChevronUp,
    faTimes,
  } from "@fortawesome/free-solid-svg-icons";
  import { faHeart, faImage } from "@fortawesome/free-regular-svg-icons";
  import { page } from "$app/stores";
  import { compareAsc, format, parseISO } from "date-fns";
  import { Activity, Avatar, Card, ProgressLinear } from "$comp";
  import Sidebar from "./_sidebar";
  import { tick, onDestroy } from "svelte";
  import { art, prompt, password, user, token, psbt } from "$lib/store";
  import countdown from "$lib/countdown";
  import {
    getArtworkSub,
    getArtwork,
    getArtworksByArtist,
  } from "$queries/artworks";
  import {
    createTransaction,
    getArtworkTransactions,
  } from "$queries/transactions";
  import { goto, err, explorer, info, units } from "$lib/utils";
  import { mutation, subscription, query, operationStore } from "@urql/svelte";
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
  import ArtworkQuery from "$components/ArtworkQuery";
  import SocialShare from "$components/SocialShare";

  function linkify(text) {
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return text.replace(urlRegex, function (url) {
      return '<a href="' + url + '">' + url + "</a>";
    });
  }

  export let id;

  const requestPolicy = "cache-and-network";

  $: disabled =
    !transactions ||
    transactions.some(
      (t) => ["purchase", "creation", "cancel"].includes(t.type) && !t.confirmed
    );

  $: pageChange($page);
  const pageChange = ({ params }) => {
    if (params.id) ({ id } = params);
    api.url("/viewed").post({ id });
  };

  let transactions = [];

  let artwork, start_counter, end_counter, now, timeout;

  $: setup(id);
  let setup = () => {
    subscription(
      operationStore(getArtworkTransactions(id)),
      (a, b) => (transactions = b.transactions)
    );

    subscription(
      operationStore(getArtworkSub(id)),
      (a, b) => (artwork = b.artworks_by_pk)
    );
  };

  onDestroy(() => ($art = undefined));

  $: update(artwork);
  let update = () => {
    if (!artwork) return;
    $art = artwork;

    let count = () => {
      clearTimeout(timeout);
      now = new Date();
      if (!artwork) return;
      start_counter = countdown(parseISO(artwork.auction_start)) || "";
      end_counter = countdown(parseISO(artwork.auction_end)) || "";
      timeout = setTimeout(count, 1000);
    };
    count();

    [sats, val, ticker] = units(artwork && artwork.asking_asset);
    list_price = artwork.list_price;
    list_price = val(artwork.list_price);
  };

  let others = [];

  let createTransaction$ = mutation(createTransaction);

  let list_price;
  let val, sats, ticker;
  let amount;

  $: transaction.amount = sats && sats(amount);

  let makeOffer = async (e) => {
    if (e) e.preventDefault();
    offering = true;

    await requirePassword();

    try {
      $psbt = await createOffer(artwork, transaction.amount, 500);
    } catch (e) {
      err(e);
      offering = false;
      return;
    }

    $psbt = await sign();
    transaction.psbt = $psbt.toBase64();
    transaction.hash = $psbt.__CACHE.__TX.getId();
    await save();
    offering = false;
  };

  let save = async (e) => {
    transaction.artwork_id = artwork.id;
    transaction.asset = artwork.asking_asset;
    let result = await createTransaction$({ transaction });
    if (result.error)
      return err(
        `Problem placing bid, minimum bid is ${val(
          artwork.bid[0].amount + 1000
        )}`
      );
    if (transaction.type === "purchase") info("Sold! Congratulations!");
    if (transaction.type === "bid") info("Bid placed!");
    bidding = false;
  };

  let bidding, amountInput, offering;
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
      $psbt = await sign();

      if (artwork.royalty || artwork.auction_end) {
        $psbt = await requestSignature($psbt);
      }

      await broadcast($psbt);

      let tx = $psbt.extractTransaction();
      transaction.hash = tx.getId();
      transaction.psbt = $psbt.toBase64();

      await save();

      transaction.amount = 1;
      transaction.asset = artwork.asset;
      transaction.user;
    } catch (e) {
      err(e);
    }

    loading = false;
  };

  let showPopup = false;
  let showMore = false;
  let showActivity = false;
</script>

<style>
  :global(.description a) {
    color: #3ba5ac;
  }

  .disabled {
    @apply text-gray-400 border-gray-400;
  }

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

  .social-share a {
    color: #2d2e32;
    font-size: 16px;
  }

  .popup {
    position: fixed;
    z-index: 900;
    width: 100%;
    height: 100vh;
    padding: 5px;
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
    padding: 11px 15px;
    cursor: pointer;
  }

  .mob-desc {
    display: none;
  }

  .mobileImage {
    display: none;
    margin-bottom: 40px;
  }

  .mobileImage :global(.cover) {
    width: 100%;
  }

  .popup :global(video) {
    width: 50%;
    height: auto !important;
    margin: 0 auto;
  }

  .popup :global(div) {
    width: 100%;
    height: auto;
  }

  .popup :global(.card-link) {
    height: auto !important;
  }

  .popup :global(img) {
    margin: 0 auto;
    height: 95vh;
    object-fit: contain !important;
  }

  .desktopImage :global(img),
  .desktopImage :global(video) {
    margin: 0 auto;
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
    .desc-text {
      height: 150px;
      overflow: hidden;
    }

    .openDesc {
      height: auto !important;
      overflow: visible;
    }

    .show-more {
      color: #3ba5ac;
      font-weight: bold;
      text-align: right;
      margin-top: 10px;
      cursor: pointer;
      white-space: normal;
    }

    .desktopImage,
    .desk-desc {
      display: none;
    }

    .mobileImage,
    .mob-desc {
      display: block;
    }

    .closeButton {
      top: 20px;
      right: 20px;
    }
  }

  @media only screen and (max-width: 500px) {
    .popup :global(img),
    .popup :global(video) {
      height: auto;
      width: 100%;
    }
  }
</style>

{#if artwork}
  <ArtworkQuery id={artwork.id} />
{/if}

<div class="container mx-auto mt-10 md:mt-20">
  {#if artwork}
    <div class="flex flex-wrap">
      <div class="lg:text-left w-full lg:w-1/3 lg:max-w-xs">
        <h1 class="text-3xl font-black primary-color">
          {artwork.title || 'Untitled'}
        </h1>
        <div class="flex mt-4 mb-6">
          <div class="my-auto">
            Edition
            {artwork.edition}
            of
            {artwork.editions}
          </div>
          {#if artwork.is_physical}
            <div
              class="flex ml-auto py-1 px-4 bg-gray-100 rounded rounded-full my-auto">
              <div class="my-auto">
                <Fa icon={faImage} class="mr-1" />
              </div>
              <div class="my-auto mb-1">
                <span class="text-sm">Physical artwork</span>
              </div>
            </div>
          {/if}
        </div>

        <div class="flex flex-wrap justify-between text-left">
          <a href={`/u/${artwork.artist.username}`}>
            <div class="flex mb-6">
              <Avatar user={artwork.artist} />
              <div class="ml-2 secondary-color">
                <div>@{artwork.artist.username}</div>
                <div class="text-xs text-gray-600">Artist</div>
              </div>
            </div>
          </a>
          <a href={`/u/${artwork.owner.username}`}>
            <div class="flex mb-6 secondary-color">
              <Avatar user={artwork.owner} />
              <div class="ml-2">
                <div>@{artwork.owner.username}</div>
                <div class="text-xs text-gray-600">Owner</div>
              </div>
            </div>
          </a>
        </div>

        <div class="mobileImage">
          <span on:click={() => (showPopup = !showPopup)}>
            <Card {artwork} columns={1} showDetails={false} thumb={false} />
          </span>
        </div>

        <div class="flex justify-between mb-6">
          {#if artwork.list_price}
            <div class="my-2">
              <div class="text-sm mt-auto">List Price</div>
              <div class="text-lg">{list_price} {ticker}</div>
            </div>
          {/if}
          {#if artwork.reserve_price}
            <div class="my-2">
              <div class="text-sm mt-auto">Reserve Price</div>
              <div class="flex-1 text-lg">
                {val(artwork.reserve_price)}
                {ticker}
              </div>
            </div>
          {/if}
          {#if artwork.bid.length && artwork.bid[0].amount}
            <div class="my-2">
              <div class="text-sm mt-auto">Current bid</div>
              <div class="text-lg">{val(artwork.bid[0].amount)} {ticker}</div>
            </div>
          {/if}
        </div>

        {#if loading}
          <ProgressLinear />
        {:else if $user && $user.id === artwork.owner_id}
          <div class="w-full mb-2">
            <a
              href={disabled ? '' : `/artwork/${id}/auction`}
              class="block text-center text-sm secondary-btn w-full"
              class:disabled>List</a>
          </div>
          {#if $user.id === artwork.artist_id}
            <div class="w-full mb-2">
              <a
                href={`/artwork/${id}/edit`}
                class="block text-center text-sm secondary-btn w-full"
                class:disabled>Edit</a>
            </div>
          {/if}
        {:else if artwork.asking_asset}
          {#if artwork.list_price}
            <button
              on:click={buyNow}
              class="secondary-btn"
              {disabled}
              class:disabled>Buy now</button>
          {/if}
          {#if bidding}
            {#if offering}
              <ProgressLinear />
            {:else}
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
            {/if}
          {:else if !artwork.auction_start || compareAsc(now, parseISO(artwork.auction_start)) === 1}
            <button
              on:click={startBidding}
              class="secondary-btn"
              {disabled}
              class:disabled>Make an offer</button>
          {/if}
        {/if}

        {#if compareAsc(parseISO(artwork.auction_start), now) === 1 && start_counter}
          <div class="bg-gray-100 px-4 p-1 mt-6 rounded">
            <div class="mt-auto text-sm">Auction starts in</div>
            <div class="mt-1">{start_counter}</div>
          </div>
        {/if}

        {#if compareAsc(parseISO(artwork.auction_end), now) === 1 && end_counter}
          <div class="bg-gray-100 px-4 p-1 mt-6 rounded">
            <div class="mt-auto text-sm">Auction closes in</div>
            <div class="mt-1">{end_counter}</div>
          </div>
        {:else if artwork.auction_end}
          <div class="bg-gray-100 px-4 p-1 mt-6 rounded">
            <div class="mt-auto text-sm">Auction ended at</div>
            <div class="mt-1">
              {format(parseISO(artwork.auction_end), 'yyyy-MM-dd HH:mm')}
            </div>
          </div>
        {/if}

        <Sidebar bind:artwork />

        {#if artwork.description}
          <div
            class="mob-desc description text-gray-600 whitespace-pre-wrap break-words">
            <h4 class="mt-10 font-bold">About this artwork</h4>
            <div class="desc-text {showMore ? 'openDesc' : ''}">
              {@html linkify(artwork.description)}
            </div>
            <div class="show-more" on:click={() => (showMore = !showMore)}>
              SHOW
              {showMore ? 'LESS -' : 'MORE +'}
            </div>
          </div>
        {/if}

        <p class="font-bold mt-20">History</p>
        <div class="flex mt-5">
          <div class="w-full">
            {#each transactions.slice(0, showActivity ? transactions.length : 3) as transaction}
              <Activity {transaction} />
            {/each}
            {#if transactions.length > 3}
              <div
                class="flex text-xs cursor-pointer"
                on:click={() => (showActivity = !showActivity)}>
                <div>View {showActivity ? 'less' : 'more'}</div>
                <div class="my-auto ml-1">
                  <Fa icon={showActivity ? faChevronUp : faChevronDown} />
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>

      <div class="w-full lg:w-2/3 pl-40">
        <div class="desktopImage">
          <span on:click={() => (showPopup = !showPopup)}>
            <Card {artwork} columns={1} showDetails={false} thumb={false} />
          </span>
        </div>

        {#if artwork.description}
          <div class="desk-desc description text-gray-600 break-words">
            <h4 class="mt-10 mb-5 font-bold">About this artwork</h4>
            <div class="whitespace-pre-wrap">
              {@html linkify(artwork.description)}
            </div>
          </div>
        {/if}

        <div
          on:click={() => (showPopup = !showPopup)}
          class:showPopup
          class="popup">
          <span class="closeButton"><Fa icon={faTimes} /></span>
          <Card
            {artwork}
            columns={1}
            showDetails={false}
            thumb={false}
            popup={true} />
        </div>

        {#if others.length}
          <div class="w-full mt-28">
            <h2 class="text-2xl font-bold primary-color py-10 px-0 md:px-5">
              More by this artist
            </h2>
            <div class="w-full flex flex-wrap">
              {#each others as artwork (artwork.id)}
                <div class="w-full lg:w-full xl:w-1/2 px-0 md:px-5 mb-20">
                  <Card {artwork} />
                </div>
              {/each}
              <div class="flex w-full">
                <a
                  class="primary-btn mx-auto mb-12"
                  href={`/artist/${artwork.artist.username}`}>View gallery</a>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <ProgressLinear />
  {/if}
</div>
