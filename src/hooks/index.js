import decode from "jwt-decode";
import cookie from "cookie";
import { auth, hbp, q } from "$lib/api";
import { addMinutes } from "date-fns";
import { getUser } from "$queries/users";

const sessions = {};
const testo = {};

export async function handle({ request, resolve }) {
  const { headers } = request;
  const cookies = cookie.parse(headers.cookie || "");
  console.log("cookies", cookies);
  console.log("sessions", sessions);
  testo.ohyeah = true;
  let { refresh_token } = cookies;

  let jwt = sessions[refresh_token];
  let expired;
  let setCookie;

  try {
    decode(jwt);
  } catch (e) {
    if (refresh_token) {
      try {
        let res = await hbp
          .url("/auth/token/refresh")
          .headers(headers)
          .get()
          .res();
        jwt = (await res.json()).jwt_token;

        auth({ authorization: `Bearer ${jwt}` });
        console.log("getting user");
        let { currentuser } = await q(getUser);
        request.locals.user = currentuser[0];
        console.log("jwt", jwt);
        setCookie = res.headers.get("set-cookie") || "";
        /* sveltekit has a bug preventing you from setting multiple cookies so we'll store this on the server for now
          cookie.serialize("jwt", jwt, {
            expires: addMinutes(new Date(), 15),
            httpOnly: true,
            path: "/",
            maxAge: 60 * 15,
            sameSite: 'lax',
          });
          */
        sessions[refresh_token] = jwt;
      } catch (e) {
        console.log(e);
        if (e.message.includes("Invalid")) expired = true;
      }
    }
  }

  if (jwt) request.locals.jwt = jwt;
  else request.locals.user = {};

  console.log(request.locals);

  const response = await resolve(request);

  /* clear expired refresh token
  if (expired)
    response.headers["set-cookie"] =
      "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  else */
  if (setCookie) {
    response.headers["set-cookie"] = setCookie;
  }

  return response;
}

export function getSession({ locals }) {
  return {
    user: locals.user,
  };
}
