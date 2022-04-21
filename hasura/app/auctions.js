import { api, q } from "./api.js";
import { formatISO, compareAsc, parseISO } from "date-fns";
import { combine, release, sign, broadcast } from "./wallet.js";
import { check } from "./signing.js";
import {
  cancelBids,
  closeAuction,
  getFinishedAuctions,
  releaseToken,
} from "./queries.js";

setInterval(async () => {
  try {
    let { artworks } = await q(getFinishedAuctions, {
      now: formatISO(new Date()),
    });

    for (let i = 0; i < artworks.length; i++) {
      let artwork = artworks[i];
      let { bid } = artwork;

      await q(closeAuction, {
        id: artwork.id,
        artwork: {
          auction_start: null,
          auction_end: null,
        },
      });

      console.log("finalizing auction for", artwork.slug);
      console.log("reserve price", artwork.reserve_price);

      try {
        if (
          !(bid && bid.psbt) ||
          compareAsc(parseISO(bid.created_at), parseISO(artwork.auction_end)) >
            0 ||
          bid.amount < artwork.reserve_price
        )
          throw new Error("no bid");

        let combined = combine(artwork.auction_tx, bid.psbt);

        await check(combined);

        let psbt = await sign(combined);

        await broadcast(psbt);

        await q(releaseToken, {
          id: artwork.id,
          owner_id: bid.user.id,
          amount: bid.amount,
          hash: psbt.extractTransaction().getId(),
          psbt: psbt.toBase64(),
          asset: artwork.asking_asset,
          bid_id: bid.id,
          type: "release",
        });

        console.log("released to high bidder");
      } catch (e) {
        console.log("couldn't release to bidder,", e.message);

        await q(cancelBids, {
          id: artwork.id,
          start: artwork.auction_start,
          end: artwork.auction_end,
        });

        if (artwork.has_royalty) continue;

        try {
          let psbt = await sign(artwork.auction_release_tx);
          await broadcast(psbt);

          console.log("released to current owner");

          await q(releaseToken, {
            id: artwork.id,
            owner_id: artwork.owner.id,
            amount: 0,
            hash: psbt.extractTransaction().getId(),
            psbt: psbt.toBase64(),
            asset: artwork.asking_asset,
            type: "return",
          });
        } catch (e) {
          console.log("problem releasing", e);
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
}, 2000);
