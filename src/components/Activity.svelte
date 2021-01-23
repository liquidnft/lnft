<script>
  import Avatar from "$components/Avatar";
  import Card from "$components/Card";
  import { user } from "$lib/store";
  import { formatDistanceStrict } from "date-fns";
  import { ticker, val } from "$lib/utils";

  export let transaction;
  export let showImage = false;
</script>

<style>
  a {
    color: #3ba5ac;
  }

  .divider {
    border: 1px solid #e4e4e4;
    margin: 50px 0;
  }
</style>

<div class="flex gap-2 mb-4 text-left">
  <Avatar src={transaction.user.avatar_url} />
  <div class="ml-2">
    <div>
      <a href={`/user/${transaction.user.id}`}>@{transaction.user.username}</a>
      {#if transaction.type === 'bid'}
        offered
        {val(transaction.asset, transaction.amount)}
        {ticker(transaction.asset)}
        for
      {:else if transaction.type === 'creation'}
        created
      {:else if transaction.type === 'purchase'}
        paid
        {val(transaction.asset, transaction.amount)}
        {ticker(transaction.asset)}
        for
      {:else if transaction.type === 'accept'}
        accepted 
        {val(transaction.asset, transaction.amount)}
        {ticker(transaction.asset)}
        from
        <a
          href={`/user/${transaction.artwork.owner.id}`}>@{transaction.artwork.owner.username}</a>
        for
      {/if}
      <a
        href={`/artwork/${transaction.artwork.id}`}>{transaction.artwork.title}</a>
    </div>
    <div>
      <span class="font-medium text-gray-600 text-xs">
        {formatDistanceStrict(new Date(transaction.created_at), new Date())}
        ago
      </span>
      <a href={`/tx/${transaction.id}`} class="text-xs text-green-400">
        [view tx]
      </a>
    </div>
  </div>
</div>

{#if showImage}
  <Card artwork={transaction.artwork} columns={2} showDetails={false} />
  <hr class="mb-6 divider" />
{/if}
