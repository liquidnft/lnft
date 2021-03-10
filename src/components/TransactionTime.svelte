<script>
  import { user } from "$lib/store";
  import {
    isWithinInterval,
    parseISO,
    compareAsc,
    formatDistanceStrict,
  } from "date-fns";
  import AcceptOffer from "$components/AcceptOffer";
  export let transaction;

  let comp;

  const canAccept = ({ type, artwork, created_at }) => {
    const isCurrent = ({ transferred_at: t }) =>
      type === "bid" && (!t || compareAsc(parseISO(created_at), parseISO(t)));

    const isOwner = ({ owner }) => $user && $user.id === owner.id;

    const underway = ({ auction_start: s, auction_end: e }) =>
      !e ||
      !isWithinInterval(new Date(), { start: parseISO(s), end: parseISO(e) });

    return isCurrent(artwork) && isOwner(artwork) && !underway(artwork);
  };
</script>

<style>
  div,
  a,
  span {
    @apply break-all;
  }

  .pending {
    @apply rounded bg-yellow-200 text-center rounded-full text-xs p-1 px-2;
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
  {#if canAccept(transaction)}
    <a
      href="#"
      on:click={() => comp.accept(transaction)}
      class="text-sm secondary-color">
      [accept]
    </a>
  {/if}
  {#if ['creation', 'purchase', 'accept', 'royalty', 'auction', 'release'].includes(transaction.type) && !transaction.confirmed}
    <span class="pending">Pending</span>
  {/if}
</div>
