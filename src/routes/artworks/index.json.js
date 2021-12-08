import { countArtworks, getLimited } from "$queries/artworks";
import { hbp } from "$lib/api";

export async function get({ headers, locals, query }) {
  let { q } = locals;
  let limit = parseInt(query.get("limit")) || 5000;
  let offset = 0;
  let where = {};
  let order_by = {
    created_at: "desc",
  };

  try {
    let { artworks_aggregate: a } = await q(countArtworks, { where });
    let { sequenced: artworks } = await q(getLimited, { limit, offset, order_by, where });

    return {
      body: {
        artworks,
        count: a.aggregate.count,
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
