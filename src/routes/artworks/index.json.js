import { countArtworks, getLimited } from "$queries/artworks";
import wretch from "wretch";

export async function get({ headers, query }) {
  let limit = 2000;
  let offset = 0;
  let where = {};
  let order_by = {
    created_at: "desc",
  };

  let { authorization } = headers;
  let api = wretch().url("http://localhost:8080/v1/graphql");

  if (authorization) api = api.auth(authorization);
  let { data, errors } = await api
    .post({
      query: getLimited,
      variables: { limit, offset, order_by, where },
    })
    .json();
  if (errors) throw new Error(errors[0].message);
  let { artworks } = data;

  return {
    body: {
      artworks,
    },
  };
}
