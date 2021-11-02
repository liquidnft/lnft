import { countArtworks, getLimited } from "$queries/artworks";
import { auth, q } from "$lib/api";

export async function get({ headers, query }) {
  let limit = parseInt(query.get('limit')) || 5000;
  let offset = 0;
  let where = {};
  let order_by = {
    created_at: "desc",
  };

  auth(headers);

  let { artworks_aggregate: a } = await q(countArtworks, { where });
  let { artworks } = await q(getLimited, { limit, offset, order_by, where });

  return {
    body: {
      artworks,
      count: a.aggregate.count
    },
  };
}
