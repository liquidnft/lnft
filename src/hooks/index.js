import decode from "jwt-decode";
import cookie from "cookie";
import { hbp, q, refresh, sessions } from "$lib/api";

export async function handle({ request, resolve }) {
  const { headers } = request;
  const cookies = cookie.parse(headers.cookie || "");
  let { refresh_token } = cookies;

  let jwt = sessions[refresh_token];
  let user, setCookie;

  try {
    decode(jwt);
  } catch (e) {
    try {
      ({ jwt, user, setCookie } = await refresh(headers));
      sessions[refresh_token] = jwt;
      headers.authorization = `Bearer ${jwt}`;
    } catch (e) {
      console.log(e);
    }
  }

  request.locals = { 
    q: sapi(headers),
    user
  };

  const response = await resolve(request);

  if (setCookie) response.headers["set-cookie"] = setCookie;

  return response;
}

export const getSession = ({ locals: { user }}) => ({ user });

