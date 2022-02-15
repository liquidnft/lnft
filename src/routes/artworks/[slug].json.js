import { validate } from "uuid";
import {
  getArtwork,
  getArtworksByArtist,
  getArtworkBySlug,
} from "$queries/artworks";
import { getArtworkTransactions } from "$queries/transactions";
import { hbp } from "$lib/api";

export async function get({ request: { headers }, locals, params }) {
  try {
    let { slug } = params;
    let { q } = locals;

    let artwork;
    if (validate(slug)) {
      ({ artworks_by_pk: artwork } = await q(getArtwork, { id: slug }));
    } else {
      let { artworks } = await q(getArtworkBySlug, { slug });
      artwork = artworks[0];
    }

    if (!artwork) return { status: 500 };

    let { artworks: others } = await q(getArtworksByArtist, {
      id: artwork.artist_id,
    });

    others = others.filter((a) => a.id !== artwork.id).slice(0, 3);

    return {
      body: {
        artwork,
        others,
      },
      headers,
    };
  } catch (e) {
    console.log(e);
    return {};
  }
}
