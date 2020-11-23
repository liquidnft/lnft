import { get } from "svelte/store";
import { operationStore, query } from "@urql/svelte";
import { gql } from "$lib/api";

const fields = `
  id,
  title,
  artist_id,
  owner_id,
  filename,
  favorited,
  list_price,
  last_active,
  created_at
`;

export const getArtworks = `subscription {
 artworks {
   ${fields},
   bid {
     user {
       id
       username
     } 
     amount 
   } 
 }
}`;

export const create = {
  query: `mutation insert_single_artwork($artwork: artworks_insert_input!) {
      insert_artworks_one(object: $artwork) {
        id
      }
    }`,
};

export const destroyArtwork = (token, artwork) =>
  gql.auth(`Bearer ${token}`).post({
    query: `mutation {
      delete_artworks_by_pk(id: "${artwork.id}") {
        id
      }
    }`,
  });

export const getArtwork = (id) =>
  operationStore(`query {
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
        avatar_url
      },
      owner {
        username
        avatar_url
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
  }`);
