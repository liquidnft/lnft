import { serverApi } from "$lib/api";

export async function post({ locals, request }) {
  let { q } = locals;
  console.log("YO");

  try {
    let body = await request.json();
    const res = await serverApi.url("/comment").post(body).res();
    body = await res.json();

    return {
      body,
    };
  } catch (e) {
    console.log("Error adding comment", e);
    return {
      body: { message: "Error adding comment" },
      status: 500,
    };
  }
}
