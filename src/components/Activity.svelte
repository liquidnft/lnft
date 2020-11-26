<script>
  import { Avatar } from "$comp";
  import { user } from "$lib/store";
  import { formatDistanceStrict } from "date-fns";
  export let transaction;
</script>

<style>
  a {
    @apply text-green-400;
  }
</style>

<div class="flex flex-wrap mb-4">
  <Avatar src={transaction.user.avatar_url} />
  <div class="ml-2">
    <div>
      <a href={`/user/${transaction.user.id}`}>@{transaction.user.username}</a>
      {#if transaction.type === 'bid'}
        placed a bid for {transaction.amount} BTC on
      {:else if transaction.type === 'created'}
        created
      {:else if transaction.type === 'purchase'}
        paid {transaction.amount} BTC for
      {:else if transaction.type === 'accept'}
        accepted a bid of {transaction.amount} BTC for
      {/if}
      <a
        href={`/artwork/${transaction.artwork.id}`}>{transaction.artwork.title}</a>
    </div>
    <div class="uppercase font-medium text-gray-600 text-sm">
      {formatDistanceStrict(new Date(transaction.created_at), new Date())}
      ago
    </div>
  </div>
</div>
