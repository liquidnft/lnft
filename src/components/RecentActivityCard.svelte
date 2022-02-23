<script>
  import { goto } from "$lib/utils";
  import {
    ArtworkMedia,
    Avatar,
    Card,
    TransactionTime,
    TransactionText,
  } from "$comp";
  export let transaction;

  let { artwork } = transaction;
</script>

{#if artwork}
  <div class="recent-container flex flex-col pr-10 lg:w-1/3">
    <div class="recentCard flex-grow flex">
      <div class="mt-2 mr-4">
        <Avatar user={transaction.user} />
      </div>
      <div class="flex flex-col">
        <p class="mt-2 break-all">
          <TransactionText {transaction} />
        </p>
        <p class="text-sm">
          <TransactionTime {transaction} />
        </p>
      </div>
    </div>
    <a href={`/a/${artwork.slug}`}>
      <div class="w-full flex rounded-lg box-shadow thumb">
        <ArtworkMedia {artwork} showDetails={false} />
      </div>
    </a>
  </div>
{/if}

<style>
  .thumb {
    overflow: hidden;
    cursor: pointer;
    height: 300px;
    margin-top: 20px;
  }

  .recent-container :global(video),
  .recent-container :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover !important;
  }

  @media only screen and (max-width: 1024px) {
    .recentCard {
      width: 300px;
    }
  }
</style>
