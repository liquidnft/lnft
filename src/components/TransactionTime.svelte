<script>
  import Fa from "svelte-fa";
  import { ProgressLinear } from "$comp";
  import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
  import { user, token } from "$lib/store";
  import {
    isWithinInterval,
    parseISO,
    compareAsc,
    formatDistanceStrict,
  } from "date-fns";
  import { AcceptOffer } from "$comp";
  import { api } from "$lib/api";
  import { err } from "$lib/utils";

  export let transaction;

  let comp, loading;

  let canCancel = ({ artwork, created_at, type, user: { id } }) =>
    type === "bid" &&
    isCurrent(artwork, created_at, type) &&
    $user &&
    $user.id === id;

  let isCurrent = ({ transferred_at: t }, created_at, type) =>
    type === "bid" && (!t || compareAsc(parseISO(created_at), parseISO(t)) > 0);

  let canAccept = ({ type, artwork, created_at }, debug) => {
    let isOwner = ({ owner }) => $user && $user.id === owner.id;

    let underway = ({ auction_start: s, auction_end: e }) =>
      e &&
      isWithinInterval(new Date(), { start: parseISO(s), end: parseISO(e) });

    return (
      artwork &&
      isCurrent(artwork, created_at, type) &&
      isOwner(artwork) &&
      !underway(artwork)
    );
  };

  $: stopLoading(transaction);
  let stopLoading = () => (loading = false);

  let cancel = ({ id }) => {
    loading = true;
    api.auth(`Bearer ${$token}`).url("/cancel").post({ id }).json().catch(err);
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

{#if loading}
  <ProgressLinear />
{:else if transaction}
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
        href="/"
        on:click|preventDefault={() => comp.accept(transaction)}
        class="text-sm secondary-color">
        [accept]
      </a>
    {/if}
    {#if canCancel(transaction)}
      <a
        href="/"
        on:click|preventDefault={() => cancel(transaction)}
        class="text-sm secondary-color">
        [cancel]
      </a>
    {/if}
    {#if ["creation", "purchase", "accept", "auction", "release", "cancel"].includes(transaction.type) && !transaction.confirmed}
      <span class="pending">Pending</span>
    {/if}
  </div>
{/if}
