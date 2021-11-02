import { validate } from "uuid";
import {
  getArtwork,
  getArtworksByArtist,
  getArtworkBySlug,
} from "$queries/artworks";
import { getArtworkTransactions } from "$queries/transactions";
import { auth, q } from "$lib/api";

const err = console.log;

export async function get({ headers, params }) {
  try {
    let { slug } = params;
    auth(headers);

    let artwork;
    if (validate(slug)) {
      ({ artworks_by_pk: artwork } = await q(getArtwork(slug)));
    } else {
      let { artworks } = await q(getArtworkBySlug(slug));
      artwork = artworks[0];
    }

    let { artworks: others } = await q(getArtworksByArtist(artwork.artist_id));

    others = others.filter((a) => a.id !== artwork.id).slice(0, 4);

    let { transactions } = await q(getArtworkTransactions(artwork.id));

    return {
      body: {
        artwork,
        others,
        transactions,
      },
    };
  } catch (e) {
    console.log(e);
  }
}
