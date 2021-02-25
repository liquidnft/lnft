<script>
  import { user } from "$lib/store";
  import { parseISO, compareAsc, formatDistanceStrict } from "date-fns";
  import AcceptOffer from "$components/AcceptOffer";
  export let transaction;

  let comp;
</script>

<style>
  div,
  a,
  span {
    @apply break-all;
  }
</style>

<AcceptOffer bind:this={comp} />
<div>
  <span class="font-medium text-gray-600 text-xs">
    {formatDistanceStrict(new Date(transaction.created_at), new Date())}
    ago
  </span>
  <a href={`/tx/${transaction.id}`} class="text-sm secondary-color">
    [view tx]
  </a>
  {#if $user && transaction.type === 'bid' && compareAsc(parseISO(transaction.created_at), parseISO(transaction.artwork.transferred_at)) && $user.id === transaction.artwork.owner.id}
    <a
      href="#"
      on:click={() => comp.accept(transaction)}
      class="text-sm secondary-color">
      [accept]
    </a>
  {/if}
  {#if ['creation', 'purchase', 'accept', 'royalty'].includes(transaction.type) && !transaction.confirmed}
    <span class="text-yellow-500">(pending)</span>
  {/if}
</div>
