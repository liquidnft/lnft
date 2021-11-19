<script>
  import { AcceptOffer, ArtworkMedia, Activity, Card } from "$comp";
  import { val, ticker } from "$lib/utils";

  export let offers;
  let comp;

</script>

<style>
  button {
    @apply border border-black w-full uppercase text-sm font-bold py-2 px-4 rounded;
    &:hover {
      @apply border-secondary;
    }
  }

</style>

<AcceptOffer bind:this={comp} />
<div class="flex flex-wrap">
  {#each offers as offer}
    <div class="order-last md:order-first my-auto mx-auto sm:mx-auto p-4">
      <Activity transaction={offer.transaction} />  
    </div>
    <div class="mx-auto w-full md:w-32">
      <ArtworkMedia artwork={offer.transaction.artwork} />
    </div>
  {:else}
    <div class="col-span-4 mx-auto">No offers yet</div>
  {/each}
</div>
