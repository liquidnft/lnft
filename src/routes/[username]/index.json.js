import { getUserByUsername } from "$queries/users";
export async function get({
  request: { headers },
  locals: { q },
  params: { username },
}) {
  try {
    let { users } = await q(getUserByUsername, { username, artworksLimit: 10 });

    if (!users.length) throw new Error("user not found");

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
