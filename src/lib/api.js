import wretch from "wretch";
import { retry } from "wretch-middlewares";
import { token } from "$lib/store";
import { get } from "svelte/store";
import { err } from "$lib/utils";

export const api = wretch().url("/api");
export const electrs = wretch().url("/api/el");

export const hasura = wretch()
  .middlewares([retry({ maxAttempts: 2 })])
  .url("/api/v1/graphql");

export const pub = (t) => (t ? hasura.auth(`Bearer ${t}`) : hasura);
export const query = async (query, variables) => {
  let { data, errors } = await pub(get(token))
    .post({ query, variables })
    .json();
  if (errors) throw new Error(errors[0].message);
  return data;
};
