<script>
  import { goto } from "$lib/utils";
  import Avatar from "$components/Avatar";
  import ArtworkMedia from "$components/ArtworkMedia";
  import Card from "$components/Card";
  import TransactionText from "$components/TransactionText";
  import TransactionTime from "$components/TransactionTime";
  export let transaction;

  let { artwork } = transaction;
</script>

<style>
  .thumb {
    overflow: hidden;
    cursor: pointer;
    height: 300px;
  }

  .thumb :global(video, img, .cover){
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

<div class="flex flex-col px-4 mb-10 lg:w-1/3">
  <div class="recentCard flex-grow flex mb-10">
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
    class="mb-5 w-full flex rounded-lg box-shadow thumb">
    <ArtworkMedia {artwork} showDetails={false} />
  </div>
</a>
</div>
