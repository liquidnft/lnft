export const createFavorite = `mutation insert_favorites_one($artwork_id: uuid!) {
  insert_favorites_one(object: { artwork_id: $artwork_id }) {
    user_id,
    artwork_id
  } 
}`;

export const deleteFavorite = `mutation delete_favorite($artwork_id: uuid!, $user_id: uuid!) {
  delete_favorites_by_pk(artwork_id: $artwork_id, user_id: $user_id) {
    user_id
    artwork_id
  } 
}`;
