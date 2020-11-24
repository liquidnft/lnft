import decode from "jwt-decode";
import { gql } from "$lib/api";
import { operationStore, query } from "@urql/svelte";

let fields =
  "id, username, location, bio, email, full_name, website, avatar_url, followed, num_follows, num_followers";

export const get = (id) =>
  `subscription {
      users_by_pk(id: "${id}") { ${fields} }
    }`;

export const update = (u) => {
  if (!token) return;
  let user = { ...u };
  delete user.num_follows;
  delete user.num_followers;
  delete user.followed;

  return {
    query: `mutation update_user($user: users_set_input) {
      update_users_by_pk(pk_columns: { id: "${user.id}" }, _set: $user) {
        ${fields}
      }
    }`
  };
};
