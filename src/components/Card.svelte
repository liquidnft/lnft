<script>
  import goto from "$lib/goto";

  export let artwork;
  export let columns = 3;
  export let link = true;

  let click = () => {
    if (!link) return;
    goto(`/artwork/${artwork.id}`);
  } 
</script>

<style>
  .link {
    cursor: pointer;
    &:hover {
      @apply shadow-xl;
    }
  }
</style>

<div class={`lg:w-1/${columns} md:px-4 lg:px-6 mb-6`}>
  <div class="bg-white" class:link on:click={click}>
    <div class="">
      <img
        src={`/api/storage/o/public/${artwork.filename}`}
        alt=""
        class="w-full border-white border-8" />
    </div>
    <div class="px-4 py-4 md:px-10">
      <h1 class="font-bold text-lg">{artwork.title}</h1>
      <div class="flex pt-8">
        <div class="1/2 flex-1">
          <div>{artwork.list_price ? artwork.list_price : '---'} BTC</div>
          <div class="w-1/2 text-sm font-medium">List Price</div>
        </div>
        {#if artwork.bid_price}
          <div class="1/2 flex-1">
            <div>{artwork.bid_price} BTC</div>
            {#if artwork.bidder}
              <div class="text-sm font-medium">
                Current bid by
                <a href={`/user/${artwork.bidder.id}`}>@{artwork.bidder}</a>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
