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
    acceptOffer($token, offer).json((r) => {
      console.log(r);
    });
  };
</script>

<style>
  button {
    @apply border border-black w-full uppercase text-sm font-bold py-2 px-4 rounded;
    &:hover {
      @apply border-teal-400;
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
      <div
        class="my-auto mx-2 w-1/4 text-lg"
        on:click={() => goto(`/artwork/${offer.artwork.id}`)}>
        <div class="text-center">{offer.artwork.title}</div>
        <img
          src={`/api/storage/o/public/${offer.artwork.filename}`}
          alt={offer.artwork.title}
          class="h-20 w-20 mx-auto" />
      </div>
      <div class="my-auto mx-2 whitespace-no-wrap w-1/4 tex">
        {offer.amount} 
        BTC
        from @{offer.artwork.bid[0].user.username}
      </div>
      <div class="w-1/2 my-auto">
        <button on:click={() => accept(offer)}>Accept</button>
      </div>
    </div>
  {:else}
    <div class="mx-auto">No offers yet</div>
  {/each}
</div>
