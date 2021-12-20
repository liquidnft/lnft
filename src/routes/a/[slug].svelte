<script context="module">
  import { post } from "$lib/api";
  import { browser } from "$app/env";
  import branding from "$lib/branding";

  export async function load({ fetch, page: { params: { slug }} }) {
    console.log("LOADING", slug)
    const props = await fetch(`/artworks/${slug}.json`).then((r) =>
      r.json()
    );

    let { artwork } = props;

    if (!artwork)
      return {
        status: 404,
      };

    if (!browser)
      post("/artworks/viewed", { id: artwork.id }, fetch)
        .res()
        .catch(console.log);

    artwork.views++;
    props.views = artwork.views;

    let metadata = { ...branding.meta };
    metadata.title = metadata.title + " - " + artwork.title;
    metadata.keywords =
      metadata.keywords + " " + artwork.tags.map((t) => t.tag).join(" ");
    metadata.description = artwork.description;

    if (artwork.filetype.includes("video"))
      metadata.video = `/api/public/${artwork.filename}.${artwork.filetype.split("/")[1]}`;
    else metadata.image = `/api/public/${artwork.filename}.${artwork.filetype.split("/")[1]}`;

    props.metadata = metadata;

    return {
      maxage: 90,
      props,
    };
  }
</script>

<script>
  import Fa from "svelte-fa";
  import {
    faChevronDown,
    faChevronUp,
    faTimes,
  } from "@fortawesome/free-solid-svg-icons";
  import { getArtwork } from "$queries/artworks";
  import { faHeart, faImage } from "@fortawesome/free-regular-svg-icons";
  import { page } from "$app/stores";
  import { compareAsc, format, parseISO } from "date-fns";
  import {
    Activity,
    Avatar,
    Card,
    Head,
    ProgressLinear,
    RoyaltyInfo,
  } from "$comp";
  import Sidebar from "./_sidebar.svelte";
  import { tick, onDestroy } from "svelte";
  import { art, meta, prompt, password, user, token, psbt } from "$lib/store";
  import countdown from "$lib/countdown";
  import { goto, err, explorer, info, linkify, units } from "$lib/utils";
  import { requirePassword } from "$lib/auth";
  import {
    createOffer,
    executeSwap,
    requestSignature,
    sign,
    broadcast,
    releaseToSelf,
  } from "$lib/wallet";
  import { Psbt } from "liquidjs-lib";
  import { api, query } from "$lib/api";
  import { SocialShare } from "$comp";

  export let artwork, others, metadata, views;

  console.log("ARTWORK", artwork.id);

  let release = async () => {
    await requirePassword();
    $psbt = await releaseToSelf(artwork);
    $psbt = await sign();
    await broadcast($psbt);
  } 

  $: disabled =
    loading ||
    !artwork ||
    artwork.transactions.some(
      (t) => ["purchase", "creation", "cancel"].includes(t.type) && !t.confirmed
    );

  let start_counter, end_counter, now, timeout;

  let fetch = async () => {
    query(getArtwork, { id: artwork.id }).then((res) => {
      artwork = res.artworks_by_pk;
      artwork.views = views;

      $art = artwork;
    });
  };

  let poll = setInterval(fetch, 2500);

  onDestroy(() => {
    $art = undefined;
    clearInterval(poll);
  });

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

  let list_price;
  let val, sats, ticker;
  let amount;

  let transaction = {};
  let makeOffer = async (e) => {
    try {
      if (e) e.preventDefault();
      offering = true;

      transaction.amount = sats(amount);
      transaction.asset = artwork.asset;
      transaction.type = "bid";

      await requirePassword();

      $psbt = await createOffer(artwork, transaction.amount);
      $psbt = await sign();

      transaction.psbt = $psbt.toBase64();
      transaction.hash = $psbt.data.globalMap.unsignedTx.tx.getId();

      await save();
      await fetch();

      const sortedBidTransactions = artwork.transactions
        .filter((t) => t.type === "bid")
        .sort((a, b) => b.amount - a.amount);

      const highestBidTransaction = sortedBidTransactions.length
        ? sortedBidTransactions[0]
        : null;

      highestBidTransaction &&
        highestBidTransaction.user.email &&
        (await api
          .url("/mail-outbid")
          .auth(`Bearer ${$token}`)
          .post({
            to: highestBidTransaction.user.email,
            userName: highestBidTransaction.user.full_name
              ? highestBidTransaction.user.full_name
              : "",
            bidAmount: `${val(transaction.amount)} L-BTC`,
            artworkTitle: artwork.title,
            artworkUrl: `${branding.urls.protocol}/a/${artwork.slug}`,
          }));

      $user.email &&
        (await api
          .url("/mail-bid-processed")
          .auth(`Bearer ${$token}`)
          .post({
            to: $user.email,
            userName: $user.full_name ? $user.full_name : "",
            bidAmount: `${val(transaction.amount)} L-BTC`,
            artworkTitle: artwork.title,
            artworkUrl: `${branding.urls.protocol}/a/${artwork.slug}`,
          }));

      artwork.owner.email &&
        (await api
          .url("/mail-someone-bid")
          .auth(`Bearer ${$token}`)
          .post({
            to: artwork.owner.email,
            userName: artwork.owner.full_name ? artwork.owner.full_name : "",
            bidAmount: `${val(transaction.amount)} L-BTC`,
            artworkTitle: artwork.title,
            artworkUrl: `${branding.urls.protocol}/a/${artwork.slug}`,
          }));

      offering = false;
    } catch (e) {
      console.log(e);
      err(e);
      offering = false;
    }
  };

  let save = async (e) => {
    transaction.artwork_id = artwork.id;
    transaction.asset = artwork.asking_asset;

    let { data, errors } = await api
      .auth(`Bearer ${$token}`)
      .url("/transaction")
      .post({ transaction })
      .json();

    if (errors) throw new Error(errors[0].message);

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

  let loading;
  let buyNow = async () => {
    try {
      await requirePassword();
      loading = true;

      transaction.amount = -artwork.list_price;
      transaction.asset = artwork.asset;
      transaction.type = "purchase";

      $psbt = await executeSwap(artwork);
      $psbt = await sign();

      if (artwork.has_royalty || artwork.auction_end) {
        $psbt = await requestSignature($psbt);
      }

      await broadcast($psbt);

      let tx = $psbt.extractTransaction();
      transaction.hash = tx.getId();
      transaction.psbt = $psbt.toBase64();

      await save();
      await fetch();

      $user.email &&
        (await api
          .url("/mail-purchase-successful")
          .auth(`Bearer ${$token}`)
          .post({
            to: $user.email,
            userName: $user.full_name ? $user.full_name : "",
            bidAmount: `${val(artwork.list_price)} L-BTC`,
            artworkTitle: artwork.title,
            artworkUrl: `${branding.urls.protocol}/a/${artwork.slug}`,
          }));

      artwork.owner.email &&
        (await api
          .url("/mail-artwork-sold")
          .auth(`Bearer ${$token}`)
          .post({
            to: artwork.owner.email,
            userName: artwork.owner.full_name ? artwork.owner.full_name : "",
            bidAmount: `${val(artwork.list_price)} L-BTC`,
            artworkTitle: artwork.title,
            artworkUrl: `${branding.urls.protocol}/a/${artwork.slug}`,
          }));
    } catch (e) {
      err(e);
    }

    loading = false;
  };

  let showPopup = false;
  let showMore = false;
  let showActivity = false;
</script>

<Head {metadata} />

<div class="container mx-auto mt-10 md:mt-20">
  <div class="flex flex-wrap">
    <div class="lg:text-left w-full lg:w-1/3 lg:max-w-xs">
      <h1 class="text-3xl font-black primary-color">
        {artwork.title || "Untitled"}
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
            class="flex ml-auto py-1 px-4 bg-gray-100 rounded rounded-full my-auto"
          >
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
              <div class="text-xs text-gray-600">
                {artwork.held ? "" : "Presumed "}Owner
              </div>
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
            <div class="text-lg">
              {list_price}
              {ticker}
            </div>
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
        {#if artwork.bid && artwork.bid.amount}
          <div class="my-2">
            <div class="text-sm mt-auto">Current bid</div>
            <div class="text-lg">{val(artwork.bid.amount)} {ticker}</div>
          </div>
        {/if}
      </div>

      <RoyaltyInfo {artwork} />

      {#if loading}
        <ProgressLinear />
      {:else if $user && $user.id === artwork.owner_id && artwork.held}
        <div class="w-full mb-2">
          <a
            sveltekit:prefetch
            href={disabled ? "" : `/a/${artwork.slug}/auction`}
            class="block text-center text-sm secondary-btn w-full"
            class:disabled>List</a
          >
        </div>
        {#if artwork.held === "multisig" && !artwork.has_royalty && !artwork.auction_end}
          <div class="w-full mb-2">
            <a
              href="/"
              on:click|preventDefault={release}
              class="block text-center text-sm secondary-btn w-full"
              class:disabled>Release</a
            >
          </div>
        {/if}
        <div class="w-full mb-2">
          <a
            href={`/a/${artwork.slug}/transfer`}
            class="block text-center text-sm secondary-btn w-full"
            class:disabled>Transfer</a
          >
        </div>

        {#if $user.id === artwork.artist_id}
          <div class="w-full mb-2">
            <a
              href={`/a/${artwork.slug}/edit`}
              class="block text-center text-sm secondary-btn w-full"
              class:disabled>Edit</a
            >
          </div>
        {/if}
      {:else if artwork.asking_asset}
        {#if artwork.list_price}
          <button
            on:click={buyNow}
            class="secondary-btn"
            {disabled}
            class:disabled>Buy now</button
          >
        {/if}
        {#if bidding}
          {#if offering}
            <ProgressLinear />
          {:else}
            <form on:submit|preventDefault={makeOffer}>
              <div class="flex flex-col mb-4">
                <div>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <input
                      id="price"
                      class="form-input block w-full pl-7"
                      placeholder={val(0)}
                      bind:value={amount}
                      bind:this={amountInput}
                    />
                    <div
                      class="absolute inset-y-0 right-0 flex items-center mr-2"
                    >
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
            class:disabled>Make an offer</button
          >
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
            {format(parseISO(artwork.auction_end), "yyyy-MM-dd HH:mm")}
          </div>
        </div>
      {/if}

      <Sidebar bind:artwork />

      {#if artwork.description}
        <div
          class="mob-desc description text-gray-600 whitespace-pre-wrap break-words"
        >
          <h4 class="mt-10 font-bold">About this artwork</h4>
          <div class="desc-text {showMore ? 'openDesc' : ''}">
            {@html linkify(artwork.description)}
          </div>
          <div class="show-more" on:click={() => (showMore = !showMore)}>
            SHOW
            {showMore ? "LESS -" : "MORE +"}
          </div>
        </div>
      {/if}

      <p class="font-bold mt-20">History</p>
      <div class="flex mt-5">
        <div class="w-full">
          {#each artwork.transactions.slice(0, showActivity ? artwork.transactions.length : 3) as transaction}
            <Activity {transaction} />
          {/each}
          {#if artwork.transactions.length > 3}
            <div
              class="flex text-xs cursor-pointer"
              on:click={() => (showActivity = !showActivity)}
            >
              <div>View {showActivity ? "less" : "more"}</div>
              <div class="my-auto ml-1">
                <Fa icon={showActivity ? faChevronUp : faChevronDown} />
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <div class="w-full lg:w-2/3 lg:pl-40">
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
        class="popup"
      >
        <span class="closeButton"><Fa icon={faTimes} /></span>
        <Card
          {artwork}
          columns={1}
          showDetails={false}
          thumb={false}
          popup={true}
        />
      </div>

      {#if others.length}
        <div class="w-full mt-64 mb-4">
          <h2 class="text-2xl font-bold primary-color py-10 px-0">
            More by this artist
          </h2>
          <div class="w-full grid md:grid-cols-3 gap-4 others">
            {#each others as artwork (artwork.id)}
              <Card {artwork} showDetails={false} />
            {/each}
          </div>
        </div>
        <div class="flex w-full">
          <a
            class="primary-btn mx-auto mb-12"
            href={`/artist/${artwork.artist.username}`}>View all</a
          >
        </div>
      {/if}
    </div>
  </div>
</div>

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

  .others :global(img),
  .others :global(video) {
    height: 160px;
    width: 100%;
  }

  @media only screen and (max-width: 768px) {
    .popup :global(img),
    .popup :global(video) {
      height: auto;
      width: 100%;
    }

    .others :global(img),
    .others :global(video) {
      height: auto;
      width: 100%;
    }
  }
</style>
