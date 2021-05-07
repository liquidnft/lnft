<script>
  import { goto } from "$lib/utils";
  import Avatar from "$components/Avatar";
  import ArtworkMedia from "$components/ArtworkMedia";
  import Card from "$components/Card";
  import TransactionText from "$components/TransactionText";
  import TransactionTime from "$components/TransactionTime";
  import LoadingPlaceholder from "$components/LoadingPlaceholder";
  export let transaction;

  let { artwork } = transaction;
</script>

<style>
  .thumb {
    overflow: hidden;
    cursor: pointer;
    height: 300px;
    margin-top: 20px;
  }

  .recent-container :global(video), .recent-container :global(img){
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
{#if artwork}
<div class="recent-container flex flex-col pr-10 lg:w-1/3">
  <div class="recentCard flex-grow flex">
    <div class="mt-2 mr-4">
      <Avatar user={transaction.user} />
    </div>
    <div class="flex flex-col">
      <p class="mt-2 break-words">
        <TransactionText {transaction} />
      </p>
      <p class="text-sm">
        <TransactionTime {transaction} />
      </p>
    </div>
  </div>
  <a href={`/${artwork.slug}`}>
    <div
      class="w-full flex rounded-lg box-shadow thumb">
      <ArtworkMedia {artwork} showDetails={false} />
    </div>
  </a>
</div>
{:else}
<div class="flex flex-col px-4 mb-20 lg:w-1/3">
  <LoadingPlaceholder />
</div>
{/if}
