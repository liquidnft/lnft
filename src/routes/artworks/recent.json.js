import { getFeatured } from "$queries/artworks";
import { getRecentActivity, getLatestPieces } from "$queries/transactions";

export async function get({ request: { headers }, locals }) {
  let { q } = locals;

  try {
    let { featured } = await q(getFeatured);
    let { recentactivity: recent } = await q(getRecentActivity(3));
    let { transactions: latest } = await q(getLatestPieces(3));

    return {
      body: {
        featured,
        recent,
        latest,
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
