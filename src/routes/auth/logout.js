import cookie from "cookie";

export async function get(request) {
  try {
    const res = await hbp
      .headers(request.headers)
      .url("/auth/logout")
      .post()
      .res();

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
  } catch (e) {
    console.log(e);
    return {
      body: { message: "Logout failed" },
      status: 500,
    };
  }
}
