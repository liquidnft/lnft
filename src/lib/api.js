import wretch from "wretch";
import { token } from "$lib/store";
import { get } from "svelte/store";
import { err } from "$lib/utils";

const baseUrl = import.meta.env.VITE_BASE_URL || '';

export const api = wretch().url(`${baseUrl}/api`);
export const electrs = wretch().url(`${baseUrl}/api/el`);
export const hasura = wretch().url(`${baseUrl}/api/v1/graphql`);

export const pub = (t) => (t ? hasura.auth(`Bearer ${t}`) : hasura);
export const query = async (query, variables) => {
  let { data, errors } = await pub(get(token)).post({ query, variables }).json();
  if (errors) throw new Error(errors[0].message);
  return data;
};
