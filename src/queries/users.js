import decode from "jwt-decode";
import { gql } from "$lib/api";

let fields = "id, username, location, bio, email, full_name, website";

export const getUser = (token) => {
  if (!token) return;
  let id = decode(token)["https://hasura.io/jwt/claims"]["x-hasura-user-id"];

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

export const updateUser = (token, user) => {
  if (!token) return;
  let id = decode(token)["https://hasura.io/jwt/claims"]["x-hasura-user-id"];

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
        console.log("resolved", r);
        resolve(r.data.update_users_by_pk);
      })
  );
};
