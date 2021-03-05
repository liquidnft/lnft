<script>
  import Avatar from "$components/Avatar";
  import ArtworkMedia from "$components/ArtworkMedia";
  import Heart from "$components/Heart";
  import countdown from "$lib/countdown";
  import { fade, goto, units } from "$lib/utils";

  export let artwork;
  export let columns = 3;
  export let link = true;
  export let showDetails = true;
  export let shadow = !showDetails;
  export let activityPage = false;

  $: [sats, val, ticker] = units(artwork.asking_asset);

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

<style>
  .card {
    border-radius: 10px;
    @apply shadow-md;
  }

  .card img,
  .card video {
    border-radius: 10px 10px 0 0;
  }
</style>

<div
  class="{showDetails ? 'card' : ''} bg-white flex flex-col justify-between"
  in:fade>
  <a href={`/artwork/${artwork.id}`}>
    <div class="flex justify-center">
      <ArtworkMedia {artwork} {showDetails} />
    </div>
  </a>
  {#if showDetails}
    <div class="p-4">
      <div class="flex flex-row justify-between mb-2">
        <h1 class="text-xl">{artwork.title || 'Untitled'}</h1>
        <Heart {artwork} />
      </div>
      <div class="flex mb-4">
        <div class="1/2 flex-1">
          <div class="text-xl">
            {#if artwork.list_price}{val(artwork.list_price)}{:else}&mdash;{/if}
            {ticker}
          </div>
          <div class="w-1/2 text-sm font-medium">List Price</div>
        </div>
        {#if artwork.bid[0].user}
          <div class="1/2 flex-1">
            <div class="text-xl">{val(artwork.bid[0].amount)} {ticker}</div>
            <div class="text-sm font-medium">
              Current bid by
              <a
                href={`/user/${artwork.bid[0].user.id}`}>@{artwork.bid[0].user.username}</a>
            </div>
          </div>
        {/if}
      </div>

      <a href={`/user/${artwork.artist_id}`}>
        <div class="flex">
          <Avatar user={artwork.artist} />
          <div class="ml-2">
            <div>@{artwork.artist.username}</div>
            <div class="text-xs text-gray-600">Artist</div>
          </div>
        </div>
      </a>
    </div>
    {#if Date.parse(artwork.auction_end) > new Date()}
      <div class="p-3 rounded-b-lg lightblue-grad text-black">Time left: {end_counter}</div>
    {:else}
      <div class="p-3 rounded-b-lg">&nbsp;</div>
    {/if}
  {/if}
</div>
