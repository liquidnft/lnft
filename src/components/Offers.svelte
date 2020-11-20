<script>
  import goto from "$lib/goto";
  import { onMount } from "svelte";
  import Card from "$components/Card";
  import { token } from "$lib/store";
  import { getOffers, acceptOffer } from "$queries/transactions";

  let offers = [];
  onMount(async () => {
    offers = await getOffers($token);
  });

  let accept = async (offer) => {
    await acceptOffer($token, offer);
    offers = offers.filter(o => o.artwork_id !== offer.artwork_id);
  };
</script>

<style>
  button {
    @apply border border-black w-full uppercase text-sm font-bold py-2 px-4 rounded;
    &:hover {
      @apply border-green-400;
    }

    &.dangerous {
      &:hover {
        @apply border-red-400;
      }
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
