import cookie from "cookie";
import wretch from "wretch";
import * as middlewares from "wretch-middlewares";
import { get as getStore } from "svelte/store";
import { err, host } from "$lib/utils";
import { token } from "$lib/store";

const { retry } = middlewares.default || middlewares;

export const api = wretch().url(`${host}/api`);
export const electrs = wretch().url(`${host}/api/el`);

export const hasura = wretch()
  .middlewares([retry({ maxAttempts: 2 })])
  .url(`${host}/api/v1/graphql`);

export const query = async (query, variables, headers = {}) => {
  let jwt = getStore(token);
  if (jwt) headers = { ...headers, authorization: `Bearer ${jwt}` };

  let { data, errors } = await hasura
    .headers(headers)
    .post({ query, variables })
    .json();
  if (errors) throw new Error(errors[0].message);
  return data;
};

export const hbp = wretch().url(import.meta.env.VITE_HBP);
export const serverApi = wretch().url(import.meta.env.VITE_APP);

export const get = (url, fetch) =>
  wretch().polyfills({ fetch }).url(url).get().json();

export const post = (url, body, fetch) =>
  wretch().polyfills({ fetch }).url(url).post(body);

export const getQ = (defaultHeaders) => {
  const fn = async (query, variables, headers) => {
    let r = await wretch()
      .url(import.meta.env.VITE_HASURA)
      .headers(headers)
      .post({ query, variables })
      .json();
    let { data, errors } = r;
    if (errors) throw new Error(errors[0].message);
    return data;
  };

  return async (q, v, h = defaultHeaders) => {
    try {
      let r = await fn(q, v, h);
      return r;
    } catch (e) {
      if (h.authorization) delete h.authorization;
      let r = await fn(q, v, h);
      return r;
    }
  };
};
