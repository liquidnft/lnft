import decode from "jwt-decode";
import { operationStore, query } from "@urql/svelte";

let fields =
  "id, username, location, bio, email, full_name, website, avatar_url, balance";

let computed = "followed, num_follows, num_followers";

export const get = (id) => `subscription {
  users_by_pk(id: "${id}") { 
    ${fields} 
    ${computed}
  }
}`;

export const update = {
  query: `mutation update_user($user: users_set_input!, $id: uuid!) {
    update_users_by_pk(pk_columns: { id: $id }, _set: $user) {
      ${fields}
      ${computed}
    }
  }`,
};

export const getCollectors = `subscription {
  collectors { ${fields}, num_artworks }
}`;
