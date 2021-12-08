import { serverApi } from "$lib/api";
export async function post(request) {
  try {
    let body = await serverApi.url("/viewed").post(request.body).json()
    console.log("BOD", body);
    return {
      body 
    };
  } catch (e) {
    return {
      body: { message: "Problem incrementing view count" },
      status: 500,
    };
  }
}
