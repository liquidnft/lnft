import { hbp } from "$lib/api";
import cookie from "cookie";
import { addSeconds } from "date-fns";

export async function post(request) {
  try {
    const res = await hbp
      .headers(request.headers)
      .url("/auth/logout")
      .post()
      .res();

    return {
      headers: {
        "set-cookie":
          res.headers.get("set-cookie").split(",").slice(0, 2).join("") +
          ", " +
          cookie.serialize("token", "", {
            path: "/",
            expires: new Date(0),
          }),
      },
    };
  } catch (e) {
    console.log(e);
    return {
      body: { message: "Logout failed" },
      status: 500,
    };
  }
}
