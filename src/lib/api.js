import wretch from "wretch";
export const api = wretch().url("/api");

let url;
if (import.meta.env) {
  url = import.meta.env.SNOWPACK_PUBLIC_HTTP;
} else {
  url = "https://la.coinos.io/hasura/v1/graphql";
}

export const gql = wretch().url(url);
