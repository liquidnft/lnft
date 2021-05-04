<script>
  import { onMount, tick } from "svelte";
  import Card from "$components/Card";
  import { snack, prompt, psbt, token } from "$lib/store";
  import { Psbt } from "@asoltys/liquidjs-lib";
  import { getOffers, acceptOffer } from "$queries/transactions";
  import { mutation, query, operationStore } from "@urql/svelte";
  import { broadcast } from "$lib/wallet";
  import { goto, val, ticker } from "$lib/utils";
  import { requirePassword } from "$lib/auth";
  import AcceptOffer from "$components/AcceptOffer";

  let offers = [];
  let comp;

  query(operationStore(getOffers)).subscribe(({ data }) => data && (offers = data.offers)
  );
</script>

<style>
  button {
    @apply border border-black w-full uppercase text-sm font-bold py-2 px-4 rounded;
    &:hover {
      @apply border-green-400;
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
      <div class="mt-4 mx-2 whitespace-no-wrap text-center">
        {val(offer.transaction.artwork.asking_asset, offer.transaction.amount)}
        {ticker(offer.transaction.artwork.asking_asset)}
        from @{offer.transaction.artwork.bid[0].user.username}
        <a href={`/tx/${offer.id}`} class="text-xs text-green-400">
          [view tx]
        </a>
        <button on:click={() => comp.accept(offer.transaction)}>Accept</button>
      </div>
    </div>
  {:else}
    <div class="mx-auto">No offers yet</div>
  {/each}
</div>
