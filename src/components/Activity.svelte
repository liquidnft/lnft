<script>
  import { Avatar, Card } from "$comp";
  import { user } from "$lib/store";
  import { formatDistanceStrict } from "date-fns";
  export let transaction;
  export let showImage = false;
</script>

<style>
  a {
    @apply text-green-400;
  }

  .divider{
    border:1px solid #e4e4e4;
    margin: 50px 0;
  }
</style>

<div class="flex flex-wrap mb-4">
  <Avatar src={transaction.user.avatar_url} />
  <div class="ml-2">
    <div>
      <a href={`/user/${transaction.user.id}`}>@{transaction.user.username}</a>
      {#if transaction.type === 'bid'}
        placed a bid for
        {transaction.amount}
        BTC on
      {:else if transaction.type === 'creation'}
        created
      {:else if transaction.type === 'purchase'}
        paid
        {transaction.amount}
        BTC for
      {:else if transaction.type === 'accept'}
        accepted a bid of
        {transaction.amount}
        BTC for
      {/if}
      <a
        href={`/artwork/${transaction.artwork.id}`}>{transaction.artwork.title}</a>
    </div>
    <div>
      <span class="uppercase font-medium text-gray-600 text-xs">
        {formatDistanceStrict(new Date(transaction.created_at), new Date())}
        ago
      </span>
      <a href={`/tx/${transaction.hash}`} class="text-xs text-green-400">
        [view tx]
      </a>
    </div>
  </div>
</div>

{#if showImage}
  <Card artwork={transaction.artwork} columns={2} showDetails={false} />
  <hr class="mb-6 divider">
{/if}
