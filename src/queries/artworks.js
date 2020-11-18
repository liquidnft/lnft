import { gql } from "$lib/api";

const fields = `
  id,
  title,
  artist_id,
  owner_id,
  filename,
  favorited,
  list_price,
`;

export const createArtwork = (token, artwork) =>
  gql.auth(`Bearer ${token}`).post({
    query: `mutation insert_single_artwork($artwork: artworks_insert_input!) {
      insert_artworks_one(object: $artwork) {
        id
      }
    }`,
    variables: {
      artwork,
    },
  });

export const destroyArtwork = (token, artwork) =>
  gql.auth(`Bearer ${token}`).post({
    query: `mutation {
      delete_artworks_by_pk(id: "${artwork.id}") {
        id
      }
    }`,
  });

export const getArtworks = (token) =>
  new Promise((resolve) =>
    gql
      .auth(`Bearer ${token}`)
      .post({
        query: `query {
          artworks {
            ${fields}
            bid {
              user {
                id
                username
              } 
              amount 
            } 
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
          ${fields}
          bid {
            user {
              id
              username
            } 
            amount 
          } 
          artist {
            username
          },
          owner {
            username
          },
          tags {
            tag
          },
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
