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

  @media only screen and (max-width: 1024px) {
    .recentCard {
      width: 300px;
    }
  }
</style>

<div
  class="w-full lg:w-1/3 px-4 mb-10"
  on:click={() => goto(`/artwork/${artwork.id}`)}>
  <div class="h-full box-shadow rounded-lg recentCard">
    <div class="thumb">
      <ArtworkMedia {artwork} showDetails={false} />
    </div>
    <div class="p-4">
      <div class="flex justify-between mb-4">
        <h3 class="text-xl break-all font-bold">{artwork.title}</h3>
        <p class="text-right pl-5">4 BTC</p>
      </div>
      <div class="flex">
        <div
          class="my-auto cursor-pointer"
          on:click|stopPropagation={() => goto(`/user/${artwork.owner.id}`)}>
          <Avatar src={transaction.user.avatar_url} size="large" />
        </div>
        <div class="ml-5 my-auto">
          <p
            class="cursor-pointer hover:underline"
            on:click|stopPropagation={() => goto(`/user/${artwork.owner.id}`)}>
            {artwork.owner.username}
          </p>
          <p class="text-sm text-gray-500">Artist</p>
        </div>
      </div>
    </div>
  </div>
</div>
