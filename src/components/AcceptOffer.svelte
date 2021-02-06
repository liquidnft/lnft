<script>
  import { tick } from "svelte";
  import { prompt, snack, psbt, user } from "$lib/store";
  import { mutation } from "@urql/svelte";
  import { acceptOffer } from "$queries/transactions";
  import { broadcast, requestSignature } from "$lib/wallet";
  import { err, info } from "$lib/utils";
  import sign from "$lib/sign";
  import { requirePassword } from "$lib/auth";
  import { Psbt } from "@asoltys/liquidjs-lib";

  let acceptOffer$ = mutation(acceptOffer);
  export let accept = async ({ artwork, psbt: base64 }) => {
    try {
      await requirePassword();
      $psbt = Psbt.fromBase64(base64);
      await sign();
      if (artwork.royalty) {
        $psbt = await requestSignature($psbt);
      }
      await broadcast($psbt);
      acceptOffer$({
        id: artwork.id,
        owner_id: artwork.bid[0].user.id,
        amount: artwork.bid[0].amount,
        hash: $psbt.extractTransaction().getId(),
        psbt: $psbt.toBase64(),
        asset: artwork.asking_asset,
        bid_id: artwork.bid[0].id,
      });
      info("Offer accepted! Sold!");
    } catch (e) {
      err(e);
    }
  };
</script>

<svelte:options accessors={true} />
