import cookie from "cookie";
import { hbp } from "$lib/api";
import { addSeconds } from "date-fns";

const opts = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
};

export async function get({ request: { headers } }) {
  try {
    const cookies = cookie.parse(headers.get("cookie") || "");
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
            ...opts,
            maxAge: tokenExpiry,
            expires: addSeconds(new Date(), tokenExpiry),
          }),
        ],
      },
    };
  } catch (e) {
    return {
      body: {},
      status: 200,
      headers: new Headers({
        "set-cookie": [
          cookie.serialize("token", "", {
            ...opts,
            expires: new Date(0),
          }),
          cookie.serialize("refresh_token", "", {
            ...opts,
            expires: new Date(0),
          }),
        ].join(","),
      }),
    };
  }
}
