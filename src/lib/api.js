import cookie from "cookie";
import wretch from "wretch";
import * as middlewares from "wretch-middlewares";
import { token } from "$lib/store";
import { get as getFromStore } from "svelte/store";
import { err } from "$lib/utils";

const { retry } = middlewares.default || middlewares;

export const api = wretch().url("/api");
export const electrs = wretch().url("/api/el");

export const hasura = wretch()
  .middlewares([retry({ maxAttempts: 2 })])
  .url("/api/v1/graphql");

export const pub = (token, headers = {}) =>
  token ? hasura.auth(`Bearer ${token}`).headers(headers) : hasura;
export const query = async (query, variables, headers = {}) => {
  let { data, errors } = await pub(getFromStore(token), headers)
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
