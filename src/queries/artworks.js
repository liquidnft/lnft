import { gql } from "$lib/api";

export default (token) => {
  return new Promise((resolve) => {
    gql
      .auth(`Bearer ${token}`)
      .post({
        query: `query {
        artworks {
          id,
          title,
          artist_id,
          filename
        }
      }`,
      })
      .json((r) => resolve(r.data.artworks));
  });
};
