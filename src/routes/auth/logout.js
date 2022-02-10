import cookie from "cookie";

const opts = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
};

export async function post(request) {
  return {
    body: {},
    headers: {
      "set-cookie": [
        cookie.serialize("token", "", {
          ...opts,
          expires: new Date(0),
        }),
        cookie.serialize("refresh_token", "", {
          ...opts,
          expires: new Date(0),
        }),
      ],
    },
  };
}
