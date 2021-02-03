<script>
  import ArtworkMedia from "$components/ArtworkMedia";
  import { goto, units } from "$lib/utils";

  export let artwork;
  export let columns = 3;
  export let link = true;
  export let showDetails = true;
  export let shadow = !showDetails;
  export let activityPage = false

  $: [sats, val, ticker] = units(artwork.asking_asset);

  let click = () => {
    if (!link) return;
    goto(`/artwork/${artwork.id}`);
  };

  let width = "full";
  if (columns > 1) {
    width = "1/" + columns;
  }
</script>

<style>
  .link {
    cursor: pointer;
  }

  .card {
    border-radius: 10px;
    box-shadow: 1px 1px 10px 1px #cbcbcb;
    height: 600px;
  }

  .card img,
  .card video {
    border-radius: 10px 10px 0 0;
  }

  .square{
    height:450px;
  }

  
</style>

<div class="{showDetails? 'card': ""} bg-white flex flex-col justify-between" class:link on:click={click}>
  <div class="flex justify-center {activityPage? 'square' : 'h-3/5'}">
    <ArtworkMedia {artwork} {showDetails} />
  </div>
  {#if showDetails}
    <div class="p-6">
      <div class="flex flex-row justify-between">
        <h1 class="font-bold text-2xl">{artwork.title}</h1>
        <img src='/heart.png' alt="{artwork.filename}" class="w-8 h-8" />
      </div>
      <div class="flex pt-8">
        <div class="1/2 flex-1">
          <div class="text-3xl">
            {artwork.list_price ? val(artwork.list_price) : '---'}
            {ticker}
          </div>
          <div class="w-1/2 text-sm font-medium">List Price</div>
        </div>
        {#if artwork.bid[0].user}
          <div class="1/2 flex-1">
            <div class="text-3xl">{val(artwork.bid[0].amount)} {ticker}</div>
            <div class="text-sm font-medium">
              Current bid by
              <a
                href={`/user/${artwork.bid[0].user.id}`}>@{artwork.bid[0].user.username}</a>
            </div>
          </div>
        {/if}
      </div>
    </div>
    <div class="p-4 brand-color rounded-b-lg"> Auction ends in 25 minutes</div>
  {/if}
</div>
