import { gql } from "$lib/api";
import { jsonToGraphQLQuery as j2q } from "json-to-graphql-query";

// transform ['a', 'b', 'c'] to { a: true, b: true, c: true }
let fields = (f) => f.reduce((a, b) => ({ ...a, [b]: true }), {});

export default (token) =>
  new Promise((resolve) =>
    gql
      .auth(`Bearer ${token}`)
      .post({
        query: j2q({
          query: { artworks: fields(["id", "title", "artist_id", "filename"]) },
        }),
      })
      .json((r) => resolve(r.data.artworks))
  );

export const getArtwork = (token, id) =>
  new Promise((resolve) =>
    gql
      .auth(`Bearer ${token}`)
      .post({
        query: j2q({
          query: {
            artworks_by_pk: {
              __args: { id },
              ...fields([
                "id",
                "title",
                "description",
                "artist_id",
                "filename",
                "favorited",
              ]),
              artist: {
                username: true,
              },
              owner: {
                username: true,
              },
              tags: {
                tag: true,
              },
              favorites_aggregate: {
                __args: {
                  where: {
                    artwork_id: { _eq: id },
                  },
                },
                aggregate: {
                  count: true,
                },
              },
            },
          },
        }),
      })
      .json((r) => {
        let artwork = r.data.artworks_by_pk;
        artwork.favorites = artwork.favorites_aggregate.aggregate.count;
        resolve(artwork);
      })
  );
