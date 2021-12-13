import { serverApi } from "$lib/api";
import cookie from "cookie";
import { addSeconds } from "date-fns";
import { getUser } from "$queries/users";

export async function post(request) {
  let { locals } = request;
  let { q } = locals;

  try {
    const res = await serverApi.url("/login").post(request.body).res();
    let body = await res.json();
    let { jwt_expires_in, jwt_token } = body;

    let tokenExpiry = parseInt(jwt_expires_in / 1000);

    let { currentuser } = await q(getUser, undefined, {
      authorization: `Bearer ${jwt_token}`,
    });
    body.user = currentuser[0];

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
    console.log("Login error", e);
    return {
      body: { message: "Login failed" },
      status: 500,
    };
  }
}
