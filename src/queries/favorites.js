import { gql } from "$lib/api";

export const toggleFavorite = async (token, artwork, user_id) => {
  if (artwork.favorited) {
    let params = {
      query: `mutation delete_favorite {
          delete_favorites_by_pk(artwork_id: "${artwork.id}", user_id: "${user_id}") {
            user_id
            artwork_id
          } 
        }`,
    };

    await gql.auth(`Bearer ${token}`).post(params);
  } else {
    let params = {
      query: `mutation insert_favorites_one {
          insert_favorites_one(object: { artwork_id: "${artwork.id}" }) {
            user_id,
            artwork_id
          } 
        }`,
    };

    await gql.auth(`Bearer ${token}`).post(params);
  }
};
