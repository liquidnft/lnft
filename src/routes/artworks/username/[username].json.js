import { getArtworksByUsername } from "$queries/artworks";

export async function get({ locals, params }) {
  let { username } = params;
  let { artworks } = await locals.q(getArtworksByUsername(username));

  return {
    body: {
      artworks,
      count: artworks.length
    },
  };
}
