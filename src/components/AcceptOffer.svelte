<svelte:options accessors={true} />

<script>
  import { session } from "$app/stores";
  import { tick } from "svelte";
  import { prompt, snack, psbt } from "$lib/store";
  import { broadcast, sign, requestSignature } from "$lib/wallet";
  import { err, info } from "$lib/utils";
  import { requirePassword } from "$lib/auth";
  import { Psbt } from "liquidjs-lib";
  import { api } from "$lib/api";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export const accept = async (transaction, cb) => {
    if (transaction.accepted) return;

    try {
      let { id, amount, artwork, psbt: base64, user } = transaction;
      await requirePassword($session);
      $psbt = Psbt.fromBase64(base64);
      $psbt = await sign();
      if (artwork.has_royalty || artwork.auction_end) {
        $psbt = await requestSignature($psbt);
      }

      let result = await api
        .auth(`Bearer ${$session.jwt}`)
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

      dispatch("accepted", { id });
      transaction.accepted = true;

      info("Offer accepted! Sold!");

      cb && cb();
    } catch (e) {
      err(e);
    }
  };
</script>
