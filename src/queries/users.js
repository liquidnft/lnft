import decode from "jwt-decode";
import { gql } from "$lib/api";
import { operationStore, query } from "@urql/svelte";

let fields =
  "id, username, location, bio, email, full_name, website, avatar_url, followed, num_follows, num_followers";

export const getUser2 = (id) =>
  operationStore(
    `query {
      users_by_pk(id: "${id}") { ${fields} }
    }`
  );

export const getUser = (token, id) => {
  if (!token) return;
  if (!id)
    id = decode(token)["https://hasura.io/jwt/claims"]["x-hasura-user-id"];

  let params = {
    query: `query {
      users_by_pk(id: "${id}") { ${fields} }
    }`,
  };

  return new Promise((resolve) =>
    gql
      .auth(`Bearer ${token}`)
      .post(params)
      .json(({ data }) => resolve(data.users_by_pk))
  );
};

export const updateUser = (token, userArg) => {
  if (!token) return;
  let user = { ...userArg };
  delete user.num_follows;
  delete user.num_followers;
  delete user.followed;

  let params = {
    query: `mutation update_user($user: users_set_input) {
      update_users_by_pk(pk_columns: { id: "${user.id}" }, _set: $user) {
        ${fields}
      }
    }`,
    variables: {
      user,
    },
  };

  return new Promise((resolve) =>
    gql
      .auth(`Bearer ${token}`)
      .post(params)
      .json((r) => {
        resolve(r.data.update_users_by_pk);
      })
  );
};
