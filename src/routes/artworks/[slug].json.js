import {
  getArtwork,
  getArtworksByArtist,
  getArtworkBySlug,
} from "$queries/artworks";
import { getArtworkTransactions } from "$queries/transactions";
import wretch from "wretch";

let api = wretch().url("http://localhost:8080/v1/graphql");

const query = async (query, variables) => {
  let { data, errors } = await api.post({ query, variables }).json();
  if (errors) throw new Error(errors[0].message);
  return data;
};

const err = console.log;

export async function get({ headers, params }) {
  try {
    let { slug } = params;
    let { authorization } = headers;
    if (authorization) api = api.auth(authorization);

    let { artworks } = await query(getArtworkBySlug(slug));
    let artwork = artworks[0];

    let { artworks: others } = await query(
      getArtworksByArtist(artwork.artist_id)
    );

    others = others.filter((a) => a.id !== artwork.id).slice(0, 4);

    let { transactions } = await query(getArtworkTransactions(artwork.id));

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
