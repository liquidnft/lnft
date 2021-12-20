<script>
  import { Avatar, ArtworkMedia, Heart } from "$comp";
  import countdown from "$lib/countdown";
  import { fade, goto, units } from "$lib/utils";
  import { onMount } from "svelte";
  import { loaded } from "$lib/store";

  export let justScrolled = false;
  export let artwork;
  export let columns = 3;
  export let showDetails = true;
  export let thumb = true;
  export let popup = false;
  export let height = 350;

  $: style = height ? `height: ${height}px` : undefined;

  let sats, val, ticker;
  $: if (artwork) [sats, val, ticker] = units(artwork.asking_asset);

  let width = "full";
  if (columns > 1) {
    width = "1/" + columns;
  }

  let start_counter, end_counter;
  let count = () => {
    if (!artwork) return;
    start_counter = countdown(new Date(artwork.auction_start));
    end_counter = countdown(new Date(artwork.auction_end));
    setTimeout(count, 1000);
  };
  count();
</script>

<div
  class="{showDetails ? 'card' : ''} flex {!showDetails || $loaded[artwork.id]
    ? 'bg-white'
    : 'bg-gray-100'} flex-col justify-between h-full"
  in:fade
>
  <div {style}>
    <a href={`/a/${artwork.slug}`} sveltekit:prefetch>
      {#if $loaded[artwork.id] || !justScrolled}
        <ArtworkMedia {artwork} {showDetails} {popup} bind:thumb />
      {/if}
    </a>
  </div>
  {#if showDetails}
    <div class="bg-white mb-auto">
      <div class="p-4">
        <div class="flex flex-row justify-between mb-2">
          <a href={`/a/${artwork.slug}`}>
            <div>
              <h1 class="text-xl">
                {artwork.title || "Untitled"}
                {#if !(artwork.transferred_at || artwork.asking_asset)}
                  (unlisted)
                {/if}
              </h1>
              {#if artwork.editions > 1}
                <h2 class="text-sm text-gray-400 font-light">
                  Edition
                  {artwork.edition}
                  of
                  {artwork.editions}
                </h2>
              {/if}
            </div>
          </a>
          <Heart {artwork} />
        </div>
        <div class="flex mb-4">
          <div class="1/2 flex-1">
            <div class="price">
              {#if artwork.list_price}
                {val(artwork.list_price)}
              {:else}&mdash;{/if}
              {ticker}
            </div>
            <div class="w-1/2 text-sm font-medium">List Price</div>
          </div>
          {#if artwork.bid && artwork.bid.user}
            <div class="1/2 flex-1">
              <div class="price">{val(artwork.bid.amount)} {ticker}</div>
              <div class="text-sm font-medium">
                Current bid by
                <a href={`/u/${artwork.bid.user.username}`}
                  >@{artwork.bid.user.username}</a
                >
              </div>
            </div>
          {/if}
        </div>
        <div class="flex">
          <div>
            <a href={`/u/${artwork.artist.username}`}>
              <div class="flex">
                <Avatar user={artwork.artist} />
                <div class="ml-2">
                  <div class="break-all">@{artwork.artist.username}</div>
                  <div class="text-xs text-gray-600">Artist</div>
                </div>
              </div>
            </a>
          </div>

          {#if artwork.owner.id !== artwork.artist.id}
            <div class="ml-auto">
              <a href={`/u/${artwork.artist.username}`}>
                <div class="flex">
                  <Avatar user={artwork.owner} />
                  <div class="ml-2">
                    <div class="break-all">@{artwork.owner.username}</div>
                    <div class="text-xs text-gray-600">Owner</div>
                  </div>
                </div>
              </a>
            </div>
          {/if}
        </div>
      </div>
      {#if end_counter}
        <div class="p-3 rounded-b-lg lightblue-grad text-black">
          Time left:
          {end_counter}
        </div>
      {:else}
        <div class="p-3 rounded-b-lg">&nbsp;</div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .card {
    border-radius: 10px;
    @apply shadow-md;
  }

  .card :global(img),
  .card :global(video) {
    border-radius: 10px 10px 0 0;
  }

  .price {
    font-size: 15px;
  }
</style>
