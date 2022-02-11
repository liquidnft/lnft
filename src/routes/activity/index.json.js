import { getRecentActivity } from "$queries/transactions";

export async function get({ request: { headers }, locals }) {
  let { q } = locals;

  try {
    let { recentactivity: transactions } = await q(getRecentActivity(80));

    return {
      body: {
        transactions,
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
