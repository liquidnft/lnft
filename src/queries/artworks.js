import { get } from "svelte/store";
import { operationStore, query } from "@urql/svelte";

const fields = `
  id,
  title,
  description,
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

export const updateArtwork = {
  query: `mutation update_artwork($artwork: artworks_set_input!, $id: uuid!) {
      update_artworks_by_pk(pk_columns: { id: $id }, _set: $artwork) {
        id
      }
    }`,
};

export const updateTags = {
  query: `mutation insert_tags($tags: [tags_insert_input!]!, $artwork_id: uuid!) {
      delete_tags(where: {artwork_id: {_eq: $artwork_id}}) {
        affected_rows
      } 
      insert_tags(objects: $tags) {
        affected_rows
      }
    }`,
};

export const destroyArtwork = (artwork) => ({
  query: `mutation {
      delete_artworks_by_pk(id: "${artwork.id}") {
        id
      }
    }`,
});

export const getArtwork = (id) => `subscription {
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
      num_favorites,
      favorites_aggregate(where: {artwork_id: {_eq: "${id}"}}) {
        aggregate {
          count
        }
      }
    }
  }`;
