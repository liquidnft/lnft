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
    height: 260px;
    overflow: hidden;
    cursor: pointer;
  }

  @media only screen and (max-width: 1024px){
    .recentCard{
      width: 300px;
    }
  }
</style>

<div class="px-4 mb-10 lg:w-1/3">
    <div class="recentCard flex">
      <div class="mt-2 mr-4"><Avatar src={transaction.user.avatar_url} /></div>
      <div class="flex flex-col">
        <p class="mt-2 break-words"><TransactionText {transaction} /></p>
        <p class="text-sm"><TransactionTime {transaction} /></p>
      </div>
    </div>
    <div
      class="mb-5 h-full w-full mt-7 rounded-lg box-shadow thumb"
      on:click={() => goto(`/artwork/${artwork.id}`)}>
      <ArtworkMedia {artwork} showDetails={false} />
    </div>
</div>
