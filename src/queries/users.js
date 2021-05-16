import decode from "jwt-decode";
import { operationStore, query } from "@urql/svelte";

let fields =
  "id, username, location, bio, email, full_name, website, twitter, instagram, avatar_url, address, multisig, pubkey, confidential";

let privateFields = "is_artist, mnemonic, wallet_initialized, is_admin, info";

let computed = "followed, num_follows, num_followers";

export const getUser = `query {
  currentuser (limit: 1) { 
    ${fields} 
    ${privateFields}
  }
}`;

export const getUserById = (id) => `query {
  users_by_pk (id: "${id}") {
    ${fields} 
    ${computed}
  }
}`;

export const getUserByUsername = (username) => `query {
  users(where: { username: {_eq: "${username}" }}, limit: 1) { 
    ${fields} 
    ${computed}
  }
}`;

export const getUsers = `subscription {
  users {
    ${fields} 
    ${computed}
  }
}`;

export const getSamples = `query {
  users {
    ${fields} 
    info
    samples {
      id
      url
      type
    } 
  }
}`;

export const updateUser = {
  query: `mutation update_user($user: users_set_input!, $id: uuid!) {
    update_users_by_pk(pk_columns: { id: $id }, _set: $user) {
      ${fields}
      ${computed}
    }
  }`,
};

export const topCollectors = (limit) => `query {
  collectors(limit: ${limit}) { 
    id
    username
    avatar_url
    owned
    collected
    resold
    avg_price	
    total_price
  }
}`;

export const topArtists = (limit) => `query {
  artists(limit: ${limit}) { 
    id
    username
    avatar_url
    creations
    total_sales
    highest_sale
    avg_sale
    sold
  }
}`;

export const getUsersAddresses = `query {
  users {
    id
    address
    multisig
    username
    avatar_url
  }
}`;

export const subscribeAddresses = `subscription {
  users {
    id
    address
    multisig
    username
    avatar_url
  }
}`;
