<script>
  import { session } from "$app/stores";
  import Fa from "svelte-fa";
  import { ProgressLinear } from "$comp";
  import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
  import { formatDistanceStrict } from "date-fns";
  import { AcceptOffer } from "$comp";
  import { api } from "$lib/api";
  import { err, canAccept, canCancel, underway } from "$lib/utils";

  export let transaction;

  let comp, loading;

  $: stopLoading(transaction);
  let stopLoading = () => (loading = false);

  let cancel = ({ id }) => {
    loading = true;
    api
      .auth(`Bearer ${$session.jwt}`)
      .url("/cancel")
      .post({ id })
      .json()
      .catch(err);
  };
</script>

<AcceptOffer bind:this={comp} on:accepted />

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
        class="text-sm secondary-color"
      >
        [accept]
      </a>
    {/if}
    {#if canCancel(transaction)}
      <a
        href="/"
        on:click|preventDefault={() => cancel(transaction)}
        class="text-sm secondary-color"
      >
        [cancel]
      </a>
    {/if}
    {#if ["creation", "purchase", "accept", "auction", "release", "cancel"].includes(transaction.type) && !transaction.confirmed}
      <span class="pending">Pending</span>
    {/if}
  </div>
{/if}

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
