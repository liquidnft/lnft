<script>
  import { ticker, val } from "$lib/utils";
  export let transaction;
</script>

<div class="ml-2">
  <div>
    <a href={`/user/${transaction.user.id}`} class="secondary-color">@{transaction.user.username}</a>
    {#if transaction.type === 'bid'}
      offered
      {val(transaction.asset, transaction.amount)}
      {ticker(transaction.asset)}
      for
    {:else if transaction.type === 'creation'}
      created
    {:else if transaction.type === 'royalty'}
      added a {transaction.artwork.royalty}% royalty to
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
</div>
