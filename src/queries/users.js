import decode from "jwt-decode";
import { operationStore, query } from "@urql/svelte";

let fields =
  "id, username, location, bio, email, full_name, website, avatar_url, address, multisig, mnemonic, pubkey, is_artist, is_admin, wallet_initialized";

let computed = "followed, num_follows, num_followers";

export const getUser = (id) => `subscription {
  users_by_pk(id: "${id}") { 
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

export const updateUser = {
  query: `mutation update_user($user: users_set_input!, $id: uuid!) {
    update_users_by_pk(pk_columns: { id: $id }, _set: $user) {
      ${fields}
      ${computed}
    }
  }`,
};

export const topCollectors = `subscription {
  collectors { 
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

export const topArtists = `subscription {
  artists { 
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

export const getAddresses = `subscription {
  users {
    id
    address
    multisig
    username
    avatar_url
  }
}`;
