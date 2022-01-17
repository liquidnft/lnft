import wretch from "wretch";
import { getUser } from "$queries/users";
import decode from "jwt-decode";
import cookie from "cookie";
import { hbp, getQ } from "$lib/api";
import { addSeconds } from "date-fns";
import { prerendering } from "$app/env";

export async function handle({ request, resolve }) {
  const { headers, url: { pathname }} = request;
  const cookies = cookie.parse(headers.cookie || "");
  let { refresh_token, token: jwt } = cookies;

  let user, setCookie;

  try {
    decode(jwt);
  } catch (e) {
    try {
      if (!pathname.includes('.json') && refresh_token) {
        let res = await hbp
          .headers({ cookie: `refresh_token=${refresh_token}` })
          .url("/auth/token/refresh")
          .get()
          .res();

        let body = await res.json();
        let { jwt_token, jwt_expires_in } = body;
        jwt = jwt_token;

        let tokenExpiry = parseInt(jwt_expires_in / 1000);

        setCookie = [
          res.headers.get("set-cookie").split(",").slice(0, 2).join(""),
          cookie.serialize("token", jwt_token, {
            httpOnly: true,
            maxAge: tokenExpiry,
            sameSite: "lax",
            path: "/",
            expires: addSeconds(new Date(), tokenExpiry),
          }),
        ];
      }
    } catch (e) {
      setCookie = [
        cookie.serialize("refresh_token", "", {
          path: "/",
          expires: new Date(0),
        }),
      ];
    }
  }

  if (jwt) headers.authorization = `Bearer ${jwt}`;
  else delete headers.authorization;

  let q = getQ(headers);
  request.locals = { jwt, q };

  if (headers.authorization) {
    try {
      let { currentuser } = await q(getUser);
      user = currentuser[0];
    } catch (e) {
      // console.log(e);
    }
  }

  request.locals.user = user;

  const response = await resolve(request);

  if (setCookie && pathname !== "/auth/login")
    response.headers["set-cookie"] = setCookie;

  return response;
}

export const getSession = ({ locals: { jwt, user } }) => ({ jwt, user });
