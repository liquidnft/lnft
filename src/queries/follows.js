import { gql } from "$lib/api";

export const toggleFollow = async (token, subject, follower) => {
  if (subject.followed) {
    let params = {
      query: `mutation delete_favorite {
          delete_follows_by_pk(follower_id: "${follower.id}", user_id: "${subject.id}") {
            user_id
            follower_id
          } 
        }`,
    };

    await gql.auth(`Bearer ${token}`).post(params);
  } else {
    let params = {
      query: `mutation insert_follows_one {
          insert_follows_one(object: { user_id: "${subject.id}" }) {
            user_id
            follower_id 
          } 
        }`,
    };

    await gql.auth(`Bearer ${token}`).post(params);
  }
};
