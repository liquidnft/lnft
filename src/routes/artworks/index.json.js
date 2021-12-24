import { countArtworks, getLimited } from "$queries/artworks";
import { hbp } from "$lib/api";

export async function get({ headers, locals, query }) {
  let { q } = locals;
  let limit = parseInt(query.get("limit")) || 210;
  let offset = parseInt(query.get("offset")) || 0;
  let where = {};
  let order_by = {
    created_at: "desc",
  };

  console.log(limit, offset);

  try {
    let { artworks_aggregate: a } = await q(countArtworks, { where });
    let { artworks } = await q(getLimited, { limit, offset, order_by, where });

    return {
      body: {
        artworks,
        total: a.aggregate.count,
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
