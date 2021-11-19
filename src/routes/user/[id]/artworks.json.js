import { getUserArtworks } from "$queries/artworks";

export async function get({ headers, locals: { q }, params }) {
  try {
    let { artworks } = await q(getUserArtworks, params);

    return {
      body: {
        artworks,
      },
      headers,
    };
  } catch (e) {
    console.log(e);
    return {
      body: {},
      status: 500,
    };
  }
}
