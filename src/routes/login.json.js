import { q, log, test } from "$lib/api";
import { getUser } from "$queries/users";

export async function get({ headers, locals, params }) {
  test.ok = true
  log();

  let res = await q(getUser);
  let user = res.currentuser[0];

  console.log(user);

  return {};
}
