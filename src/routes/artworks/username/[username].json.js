import { getArtworksByUsername } from "$queries/artworks";

export async function get({ locals, params }) {
  console.log("OH");
  let { username } = params;
  let { artworks } = await locals.q(getArtworksByUsername(username));

  console.log(artworks);

  return {
    body: {
      artworks,
      count: artworks.length
    },
  };
}
