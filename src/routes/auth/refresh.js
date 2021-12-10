import cookie from "cookie";
import { hbp } from "$lib/api";
import { addSeconds } from "date-fns";

export async function get({ headers }) {
  try {
    let cookies = cookie.parse(headers.cookie || "");
    let { refresh_token, token: jwt } = cookies;
    if (!refresh_token) throw new Error("no refresh token");

    let res = await hbp
      .headers(headers)
      .url(`/auth/token/refresh?refresh_token=${refresh_token}`)
      .get()
      .res();

    let body = await res.json();
    let { jwt_token, jwt_expires_in } = body;

    let tokenExpiry = parseInt(jwt_expires_in / 1000);

    return {
      body,
      headers: {
        "set-cookie": [
          res.headers.get("set-cookie").split(",").slice(0, 2).join(""),
          cookie.serialize("token", jwt_token, {
            httpOnly: true,
            maxAge: tokenExpiry,
            sameSite: "lax",
            path: "/",
            expires: addSeconds(new Date(), tokenExpiry),
          }),
        ],
      },
    };
  } catch (e) {
    return {
      headers: {
        "set-cookie": [
          cookie.serialize("token", "", {
            path: "/",
            expires: new Date(0),
          }),
          cookie.serialize("refresh_token", "", {
            path: "/",
            expires: new Date(0),
          }),
        ],
      },
    };
  }
}
