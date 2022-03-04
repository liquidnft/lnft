import { getAppProps } from "$queries/helpers";
export async function get({ request: { headers }, locals: { q } }) {
  try {
    let { artworks: titles, users: addresses, popups } = await q(getAppProps);
    return {
      body: {
        addresses,
        titles,
        popup: popups.length ? popups[0] : null,
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
