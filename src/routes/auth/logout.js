import cookie from "cookie";

export async function post(request) {
  return {
    body: {},
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
