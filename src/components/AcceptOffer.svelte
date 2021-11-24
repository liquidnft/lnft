<svelte:options accessors={true} />

<script>
  import { tick } from "svelte";
  import { prompt, snack, psbt, user, token } from "$lib/store";
  import { broadcast, sign, requestSignature } from "$lib/wallet";
  import { err, info } from "$lib/utils";
  import { requirePassword } from "$lib/auth";
  import { Psbt } from "liquidjs-lib";
  import { api } from "$lib/api";

  export const accept = async ({ id, amount, artwork, psbt: base64, user }) => {
    try {
      await requirePassword();
      $psbt = Psbt.fromBase64(base64);
      $psbt = await sign();
      if (artwork.has_royalty || artwork.auction_end) {
        $psbt = await requestSignature($psbt);
      }

      let result = await api
        .auth(`Bearer ${$token}`)
        .url("/accept")
        .post({
          id: artwork.id,
          owner_id: user.id,
          amount,
          hash: $psbt.extractTransaction().getId(),
          psbt: $psbt.toBase64(),
          asset: artwork.asking_asset,
          bid_id: id,
        })
        .json();

      info("Offer accepted! Sold!");
    } catch (e) {
      err(e);
    }
  };
</script>
