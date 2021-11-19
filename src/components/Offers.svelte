<script>
  import { AcceptOffer, Card } from "$comp";
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
<div class="flex flex-wrap px-6">
  {#each offers as offer}
    <div class="w-full md:w-1/2 p-4">
      <Card
        artwork={offer.transaction.artwork}
        columns={1}
        showDetails={false}
        shadow={false} />
      <div class="mx-2 whitespace-no-wrap text-center">
        {val(offer.transaction.artwork.asking_asset, offer.transaction.amount)}
        {ticker(offer.transaction.artwork.asking_asset)}
        <button on:click={() => comp.accept(offer.transaction)}>Accept</button>
      </div>
    </div>
  {:else}
    <div class="mx-auto">No offers yet</div>
  {/each}
</div>
