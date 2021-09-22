<script>
  import Fa from "svelte-fa";
  import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
  import { onMount, tick } from "svelte";
  import Card from "$components/Card";
  import { snack, prompt, psbt, token } from "$lib/store";
  import { Psbt } from "@asoltys/liquidjs-lib";
  import { getOffers } from "$queries/transactions";
  import { broadcast } from "$lib/wallet";
  import { goto, val, ticker } from "$lib/utils";
  import { requirePassword } from "$lib/auth";
  import AcceptOffer from "$components/AcceptOffer";
  import { pub } from "$lib/api";

  let offers = [];
  let comp;

  onMount(async () => {
    let result = await pub($token)
      .post({
        query: getOffers,
      })
      .json();

    if (result.data) offers = result.data.offers;
    else err(result.errors[0]);
  });
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
        from @{offer.transaction.artwork.bid[0].user.username}
        <button on:click={() => comp.accept(offer.transaction)}>Accept</button>
      </div>
    </div>
  {:else}
    <div class="mx-auto">No offers yet</div>
  {/each}
</div>
