<script>
  import goto from "$lib/goto";

  export let artwork;
  export let columns = 3;
  export let link = true;
  export let showDetails = true;

  let click = () => {
    if (!link) return;
    goto(`/artwork/${artwork.id}`);
  };

  let width = "full";
  if (columns > 1) {
    width = '1/'+columns;
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

<div class={`w-full md:w-${width} px-12 mb-6`}>
  <div class="bg-white" class:link on:click={click}>
    <div class="relative" style="padding-bottom: 100%">
      {#if artwork.filename.includes('mp4')}
        <video controls class="object-cover absolute h-full w-full" autoplay muted loop>
          <source src={`/api/storage/o/public/${artwork.filename}`} />
          Your browser does not support HTML5 video.
        </video>
      {:else}
        <img
          src={`/api/storage/o/public/${artwork.filename}`}
          alt=""
          class="w-full object-cover absolute h-full shadow-2xl" />
      {/if}
    </div>
    {#if showDetails}
    <div class="px-4 py-4 md:px-10">
      <h1 class="font-bold text-lg">{artwork.title}</h1>
      <div class="flex pt-8">
        <div class="1/2 flex-1">
          <div>{artwork.list_price ? artwork.list_price : '---'} BTC</div>
          <div class="w-1/2 text-sm font-medium">List Price</div>
        </div>
        {#if artwork.bid[0].user}
          <div class="1/2 flex-1">
            <div>{artwork.bid[0].amount} BTC</div>
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
</div>
