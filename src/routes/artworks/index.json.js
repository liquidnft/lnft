import { countArtworks, getLimited } from "$queries/artworks";
import { auth, q } from "$lib/api";

export async function get({ headers, query }) {
  let limit = 2000;
  let offset = 0;
  let where = {};
  let order_by = {
    created_at: "desc",
  };

  auth(headers);

  let { artworks } = await q(
getLimited,
      { limit, offset, order_by, where }
    );

  return {
    body: {
      artworks,
    },
  };
}
