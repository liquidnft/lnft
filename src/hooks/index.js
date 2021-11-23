import wretch from "wretch";
import { getUser } from "$queries/users";
import decode from "jwt-decode";
import cookie from "cookie";
import { hbp, getQ } from "$lib/api";

export async function handle({ request, resolve }) {
  const { headers } = request;
  const cookies = cookie.parse(headers.cookie || "");
  let { refresh_token } = cookies;

  let jwt, user, setCookie;

  try {
    let res = await hbp
      .headers({ cookie: `refresh_token=${refresh_token}` })
      .url("/auth/token/refresh")
      .get()
      .res();

    ({ jwt_token: jwt } = await res.json());
    setCookie = res.headers.get("set-cookie");
    headers.authorization = `Bearer ${jwt}`;
  } catch (e) {}

  if (!headers.authorization) delete headers.authorization;

  let q = getQ(headers);
  request.locals = { jwt, q };

  if (headers.authorization) {
    try {
      let { currentuser } = await q(getUser);
      user = currentuser[0];
    } catch (e) {
      console.log(e);
    }
  }

  request.locals.user = user;

  const response = await resolve(request);

  if (setCookie && request.path !== "/auth/login")
    response.headers["set-cookie"] = setCookie;

  return response;
}

export const getSession = ({ locals: { jwt, user } }) => ({ jwt, user });
