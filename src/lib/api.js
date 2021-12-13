import cookie from "cookie";
import wretch from "wretch";
// import * as middlewares from "wretch-middlewares";
import { token } from "$lib/store";
import { get as g } from "svelte/store";
import { err } from "$lib/utils";

// const { retry } = middlewares.default || middlewares;
// wretch().polyfills({ fetch });

export const api = wretch().url("/api");
export const electrs = wretch().url("/api/el");

export const hasura = wretch()
  //  .middlewares([retry({ maxAttempts: 2 })])
  .url("/api/v1/graphql");

export const pub = (t) => (t ? hasura.auth(`Bearer ${t}`) : hasura);
export const query = async (query, variables) => {
  let { data, errors } = await pub(g(token)).post({ query, variables }).json();
  if (errors) throw new Error(errors[0].message);
  return data;
};

export const hbp = wretch().url(import.meta.env.VITE_HBP);
export const serverApi = wretch().url(import.meta.env.VITE_APP);

export const get = (url, f = fetch) =>
  wretch()
    .polyfills({ fetch: f })
    .url(url)
    .get();

export const post = (url, body, f = fetch) =>
  wretch()
    .polyfills({ fetch: f })
    .url(url)
    .post(body);

export const getQ = (defaultHeaders) => {
  const fn = async (query, variables, headers) => {
    let { data, errors } = await wretch()
      .url(import.meta.env.VITE_HASURA)
      .headers(headers)
      .post({ query, variables })
      .json();
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
