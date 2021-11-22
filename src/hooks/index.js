import wretch from "wretch";
import { getUser } from "$queries/users";
import decode from "jwt-decode";
import cookie from "cookie";
import { hbp } from "$lib/api";

const sessions = {};

export async function handle({ request, resolve }) {
  const { headers } = request;
  const cookies = cookie.parse(headers.cookie || "");
  let { refresh_token } = cookies;

  let jwt = sessions[refresh_token];
  let user, setCookie;

  try {
    decode(jwt);
  } catch (e) {
    try {
      let res = await hbp
        .headers({ cookie: `refresh_token=${refresh_token}` })
        .url("/auth/token/refresh")
        .get()
        .res();

      ({ jwt_token: jwt } = await res.json());
      setCookie = res.headers.get("set-cookie");
      ({ refresh_token } = cookie.parse(setCookie));
      sessions[refresh_token] = jwt;
    } catch (e) {
      jwt = undefined;
    }
  }

  headers.authorization = `Bearer ${jwt}`;
  if (!jwt || !headers.authorization) delete headers.authorization;

  let fn = async (query, variables) => {
    let { data, errors } = await wretch()
      .url(import.meta.env.VITE_HASURA)
      .headers(headers)
      .post({ query, variables })
      .json();
    if (errors) throw new Error(errors[0].message);
    return data;
  };

  let q = async (q, v) => {
    try {
      let r = await fn(q, v);
      return r;
    } catch (e) {
      if (headers.authorization) delete headers.authorization;
      let r = await fn(q, v);
      return r;
    }
  };

  request.locals = { jwt, q };

  try {
    let { currentuser } = await q(getUser);
    user = currentuser[0];
  } catch (e) {}

  request.locals.user = user;

  const response = await resolve(request);
  if (setCookie && request.path !== "/login")
    response.headers["set-cookie"] = setCookie;

  return response;
}

export const getSession = ({ locals: { jwt, user } }) => ({ jwt, user });
