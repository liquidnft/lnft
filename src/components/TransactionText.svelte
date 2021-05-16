<script>
  import { ticker, val } from "$lib/utils";
  export let transaction;
</script>

<div>
  <a
    href={`/u/${transaction.user.username}`}
    class="secondary-color">@{transaction.user.username}</a>
  {#if transaction.type === 'bid'}
    offered
    {val(transaction.asset, transaction.amount)}
    {ticker(transaction.asset)}
    for
  {:else if transaction.type === 'creation'}
    created
  {:else if transaction.type === 'cancel'}
    cancelled the previous listing price of
    {val(transaction.asset, transaction.amount)}
    {ticker(transaction.asset)}
    for
  {:else if transaction.type === 'listing'}
    set a listing price of
    {val(transaction.asset, transaction.amount)}
    {ticker(transaction.asset)}
    for
  {:else if transaction.type === 'return'}
    did not receive any bids for
  {:else if transaction.type === 'release'}
    won the auction for
  {:else if transaction.type === 'auction'}
    setup an auction for
  {:else if transaction.type === 'royalty'}
    added a
    {transaction.artwork.royalty}% royalty to
  {:else if transaction.type === 'purchase'}
    paid
    {val(transaction.asset, Math.abs(transaction.amount))}
    {ticker(transaction.asset)}
    for
  {:else if transaction.type === 'accept'}
    accepted
    {val(transaction.asset, transaction.amount)}
    {ticker(transaction.asset)}
    from
    <a
      href={`/u/${transaction.bid.user.username}`}
      class="secondary-color">@{transaction.bid.user.username}</a>
    for
  {/if}
  {#if transaction.artwork}
  <a
    href={`/a/${transaction.artwork.slug}`}
    class="secondary-color">{transaction.artwork.title || 'Untitled'}</a>
{/if}
</div>
