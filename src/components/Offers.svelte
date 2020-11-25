<script>
  import goto from "$lib/goto";
  import { onMount } from "svelte";
  import Card from "$components/Card";
  import { token } from "$lib/store";
  import { getOffers, acceptOffer } from "$queries/transactions";
  import { mutation, subscription, operationStore } from "@urql/svelte";

  let offers = [];
  subscription(operationStore(getOffers), (a, b) => ({ offers } = b));

  let accept;
  let acceptOffer$ = mutation(acceptOffer);
  $: if (offers.length) {
    accept = ({ artwork }) => {
      let variables = { id: artwork.id, owner_id: artwork.bid[0].user.id };
      acceptOffer$(variables);
      offers = offers.filter((o) => o.artwork_id !== artwork.id);
    };
  }
</script>

<style>
  button {
    @apply border border-black w-full uppercase text-sm font-bold py-2 px-4 rounded;
    &:hover {
      @apply border-green-400;
    }
  }
</style>

<div class="flex flex-wrap px-6">
  {#each offers as offer}
    <div class="p-4 w-full flex">
      <Card artwork={offer.artwork} columns={1} />
      <div class="mb-auto mx-2 whitespace-no-wrap text-center">
        {offer.amount}
        BTC from @{offer.artwork.bid[0].user.username}
        <button on:click={() => accept(offer)}>Accept</button>
      </div>
    </div>
  {:else}
    <div class="mx-auto">No offers yet</div>
  {/each}
</div>
