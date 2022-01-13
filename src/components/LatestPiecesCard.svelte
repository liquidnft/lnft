<script>
  import { goto } from "$lib/utils";
  import {
    Avatar,
    ArtworkMedia,
    Card,
    TransactionText,
    TransactionTime,
  } from "$comp";
  export let transaction;

  let { artwork } = transaction;
</script>

{#if artwork}
  <div
    class="latest-container w-full lg:w-1/3 pr-10"
    on:click={() => goto(`/a/${artwork.slug}`)}
  >
    <div class="h-full box-shadow rounded-lg recentCard">
      <div class="thumb">
        <ArtworkMedia {artwork} showDetails={false} />
      </div>
      <div class="p-4">
        <div class="flex justify-between mb-4">
          <h3 class="text-xl break-all font-bold">{artwork.title}</h3>
          <p class="text-right pl-5" />
        </div>
        <div class="flex">
          <div
            class="my-auto cursor-pointer"
            on:click|stopPropagation={() =>
              goto(`/${artwork.artist.username}`)}
          >
            <Avatar user={transaction.artwork.artist} size="large" />
          </div>
          <div class="ml-5 my-auto">
            <p
              class="cursor-pointer hover:underline"
              on:click|stopPropagation={() =>
                goto(`/${artwork.artist.username}`)}
            >
              {artwork.artist.username}
            </p>
            <p class="text-sm text-gray-500">Artist</p>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .thumb {
    overflow: hidden;
    cursor: pointer;
    height: 300px;
  }

  .latest-container .thumb :global(video),
  .latest-container .thumb :global(img) {
    width: 100%;
    height: 320px;
    border-radius: 10px 10px 0 0;
    object-fit: cover !important;
  }

  @media only screen and (max-width: 1024px) {
    .recentCard {
      width: 300px;
    }
  }
</style>
