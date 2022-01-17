import { countArtworks, getLimited } from "$queries/artworks";
import { hbp } from "$lib/api";

export async function post({ body, locals }) {
  try {
    let { q } = locals;
    let {
      limit = 210,
      offset = 0,
      where = {},
      order_by = { created_at: "desc" },
    } = body;

    let { artworks_aggregate: a } = await q(countArtworks, { where });
    let { artworks } = await q(getLimited, { limit, offset, order_by, where });

    return {
      body: {
        artworks,
        total: a.aggregate.count,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      body: {},
      status: 500,
    };
  }
}
