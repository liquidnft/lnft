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
    max-height: 260px;
    overflow: hidden;
    cursor: pointer;
  }
</style>

<div class="w-full md:w-1/2 lg:w-1/3 px-6 mb-10">
  <div class="flex">
    <Avatar src={transaction.user.avatar_url} />
    <div>
      <div>
        <p class="mt-2">
          <TransactionText {transaction} />
        </p>
        <p class="text-sm">
          <TransactionTime {transaction} />
        </p>
      </div>
    </div>
  </div>
  <div
    class="mb-5 w-full mt-7 rounded-lg box-shadow thumb"
    on:click={() => goto(`/artwork/${artwork.id}`)}>
    <ArtworkMedia {artwork} showDetails={false} />
  </div>
</div>
