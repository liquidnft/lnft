import { auth, q } from "$lib/api";
import { getArtworksByUsername } from "$queries/artworks";

export async function get({ headers, query, params }) {
  let { username } = params;
  auth(headers);

  let { artworks } = await q(getArtworksByUsername(username));

  return {
    body: {
      artworks,
      count: artworks.length
    },
  };
}
