import { getUserByUsername } from "$queries/users";
export async function get({ headers, locals: { q }, params: { username } }) {
  try {
    let { users } = await q(getUserByUsername, { username });

    console.log(users, username);

    return {
      body: {
        subject: users[0],
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
