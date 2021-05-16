<script>
  import Fa from "svelte-fa";
  import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
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

  let canAccept = ({ type, artwork, created_at }, debug) => {
    let isCurrent = ({ transferred_at: t }) =>
      type === "bid" && (!t || compareAsc(parseISO(created_at), parseISO(t)));

    let isOwner = ({ owner }) => $user && $user.id === owner.id;

    let underway = ({ auction_start: s, auction_end: e }) =>
      e &&
      isWithinInterval(new Date(), { start: parseISO(s), end: parseISO(e) });

    return artwork && isCurrent(artwork) && isOwner(artwork) && !underway(artwork);
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

{#if transaction}
  <div class="flex items-center mt-2">
    <span class="font-medium text-gray-600 text-xs">
      {formatDistanceStrict(new Date(transaction.created_at), new Date())}
      ago
    </span>
    <a href={`/tx/${transaction.id}`} class="text-sm secondary-color">
      <Fa class="text-xl mx-2" icon={faInfoCircle} />
    </a>
    {#if canAccept(transaction)}
      <a
        href="#"
        on:click={() => comp.accept(transaction)}
        class="text-sm secondary-color">
        [accept]
      </a>
    {/if}
    {#if ['creation', 'purchase', 'accept', 'royalty', 'auction', 'release', 'cancel'].includes(transaction.type) && !transaction.confirmed}
      <span class="pending">Pending</span>
    {/if}
  </div>
{/if}
