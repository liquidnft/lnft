
export async function get(req) {
  let user;

  try {
    let { currentuser } = await req.locals.q(getUser);
    user = currentuser[0];
  } catch (e) {
    console.log(e);
  }

  req.locals.user = user;
  console.log("USER", req.locals.user);

  return {
    body: {
      user,
    },
  };
}
