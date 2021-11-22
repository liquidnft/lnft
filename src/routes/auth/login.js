import { serverApi } from "$lib/api";

export async function post(request) {
  let { body, locals } = request
  try {
    const res = await serverApi.url("/login").post(body).res();

    let headers = {};
    let cookies = [res.headers.get('set-cookie').split(',').slice(0, 2).join("")];
    headers['set-cookie'] = cookies;

    console.log("LOGIN", headers);

    return {
      body: await res.json(),
      headers,
    };
  } catch (e) {
    return {
      body: { message: "Login failed" },
      status: 500,
    };
  }
}
