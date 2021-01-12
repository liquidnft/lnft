<script>
  import { goto, units } from "$lib/utils";

  export let artwork;
  export let columns = 3;
  export let link = true;
  export let showDetails = true;
  export let shadow = !showDetails;

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
  }

  .card img,
  .card video {
    border-radius: 10px 10px 0 0;
  }
</style>

<div class="bg-white card" class:link on:click={click}>
  <div class="relative">
    {#if artwork.filename.includes('mp4')}
      <video
        controls
        class="w-full"
        class:shadow-2xl={shadow}
        autoplay
        muted
        loop>
        <source src={`/api/storage/o/public/${artwork.filename}`} />
        Your browser does not support HTML5 video.
      </video>
    {:else}
      <img
        src={`/api/storage/o/public/${artwork.filename}`}
        alt=""
        class="w-full"
        class:shadow-2xl={shadow} />
    {/if}
  </div>
  {#if showDetails}
    <div class="px-4 py-4 md:px-10">
      <h1 class="font-bold text-lg">{artwork.title}</h1>
      <div class="flex pt-8">
        <div class="1/2 flex-1">
          <div>
            {artwork.list_price ? val(artwork.list_price) : '---'}
            {ticker}
          </div>
          <div class="w-1/2 text-sm font-medium">List Price</div>
        </div>
        {#if artwork.bid[0].user}
          <div class="1/2 flex-1">
            <div>{val(artwork.bid[0].amount)} {ticker}</div>
            <div class="text-sm font-medium">
              Current bid by
              <a
                href={`/user/${artwork.bid[0].user.id}`}>@{artwork.bid[0].user.username}</a>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
