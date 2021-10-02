export const createFollow = (subject) => `mutation insert_follows_one {
  insert_follows_one(object: { user_id: "${subject.id}" }) {
    user_id
    follower_id 
  } 
}`;

export const deleteFollow = (follower, subject) => `mutation delete_follow {
  delete_follows_by_pk(follower_id: "${follower.id}", user_id: "${subject.id}") {
    user_id
    follower_id
  } 
}`;
