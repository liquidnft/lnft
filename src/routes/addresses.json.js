import { getTitles } from "$queries/artworks";
import { getUsersAddresses } from "$queries/users";
export async function get({ headers, locals: { q } }) {
  try {
    let { artworks: titles } = await q(getTitles);
    let { users: addresses } = await q(getUsersAddresses);

    return {
      body: {
        addresses,
        titles,
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
