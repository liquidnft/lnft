import { getUser } from "$queries/users";
import { sapi } from "$lib/api";

export async function get({ locals: { q }}) {
    let { currentuser } = await q(getUser);
    user = currentuser[0];

    return {
      body: {
        user
      },
    };
}
