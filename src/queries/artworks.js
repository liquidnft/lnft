import { gql } from "$lib/api";

export const getArtworks = (token) =>
  new Promise((resolve) =>
    gql
      .auth(`Bearer ${token}`)
      .post({
        query: `query {
          artworks {
            id,
            title,
            artist_id,
            owner_id,
            filename,
            favorited
          }
        }`,
      })
      .json((r) => resolve(r.data.artworks))
  );

export const getArtwork = (token, id) =>
  new Promise((resolve) =>
    gql
      .auth(`Bearer ${token}`)
      .post({
        query: `query {
        artworks_by_pk(id: "${id}") {
          id,
          title,
          description,
          artist_id,
          owner_id,
          artist {
            username
          },
          owner {
            username
          },
          filename,
          tags {
            tag
          },
          favorited,
          favorites_aggregate(where: {artwork_id: {_eq: "${id}"}}) {
            aggregate {
              count
            }
          }
        }
      }`,
      })
      .json((r) => {
        let artwork = r.data.artworks_by_pk;
        artwork.favorites = artwork.favorites_aggregate.aggregate.count;
        resolve(artwork);
      })
  );
