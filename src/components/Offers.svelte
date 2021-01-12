<script>
  import { goto } from "$lib/utils";
  import { onMount, tick } from "svelte";
  import Card from "$components/Card";
  import { snack, prompt, psbt, token } from "$lib/store";
  import { Psbt } from "@asoltys/liquidjs-lib";
  import { getOffers, acceptOffer } from "$queries/transactions";
  import { mutation, subscription, operationStore } from "@urql/svelte";
  import { broadcast } from "$lib/wallet";
  import SignaturePrompt from "$components/SignaturePrompt";
  import { val, ticker, requirePassword } from "$lib/utils";

  let offers = [];
  let accept;
  let acceptOffer$ = mutation(acceptOffer);

  subscription(operationStore(getOffers), (a, b) => {
    offers = b.offers;

    accept = async ({ artwork, psbt: base64 }) => {
      try {
        await requirePassword();
        $psbt = Psbt.fromBase64(base64);
        $prompt = SignaturePrompt;
        await new Promise((resolve) =>
          prompt.subscribe((value) => value === "success" && resolve())
        );
        await tick();
        await broadcast($psbt);
        let params = {
          id: artwork.id,
          owner_id: artwork.bid[0].user.id,
          amount: artwork.bid[0].amount,
          psbt: $psbt.toBase64(),
          asset: artwork.asking_asset,
        };

        acceptOffer$(params);
        offers = offers.filter((o) => o.artwork_id !== artwork.id);
        $snack = "Offer accepted! Sold!";
      } catch (e) {
        $snack = e.message;
      }
    };
  });
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
    <div class="w-1/2 p-4">
      <Card artwork={offer.artwork} columns={1} showDetails={false} shadow={false} />
      <div class="mt-4 mx-2 whitespace-no-wrap text-center">
        {val(offer.artwork.asking_asset, offer.amount)}
        {ticker(offer.artwork.asking_asset)}
        from @{offer.artwork.bid[0].user.username}
        <a href={`/tx/${offer.id}`} class="text-xs text-green-400">
          [view tx]
        </a>
        <button on:click={() => accept(offer)}>Accept</button>
      </div>
    </div>
  {:else}
    <div class="mx-auto">No offers yet</div>
  {/each}
</div>
