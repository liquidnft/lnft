import { serverApi } from "$lib/api";
export async function post(request) {
  try {
    return {
      body: await serverApi.url("/viewed").post(request.body).json()
    };
  } catch (e) {
    console.log(e);
    return {
      body: { message: "Problem incrementing view count" },
      status: 500,
    };
  }
}
