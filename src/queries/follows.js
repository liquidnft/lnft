import { gql } from "$lib/api";

export const toggleFollow = async (subject, follower) => subject ?
  subject.followed
    ? {
        query: `mutation delete_favorite {
          delete_follows_by_pk(follower_id: "${follower.id}", user_id: "${subject.id}") {
            user_id
            follower_id
          } 
        }`,
      }
    : {
        query: `mutation insert_follows_one {
          insert_follows_one(object: { user_id: "${subject.id}" }) {
            user_id
            follower_id 
          } 
        }`,
      } : null;
