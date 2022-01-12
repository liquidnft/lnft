import decode from "jwt-decode";
import { marketFields as artworkFields } from "./artworks";
import { fields as txFields } from "./transactions";

let fields =
  "id, username, location, bio, email, full_name, website, twitter, instagram, avatar_url, address, multisig, pubkey, is_artist, prompt_sign";

let privateFields = "mnemonic, wallet_initialized, is_admin, info";

let computed = "followed, num_follows, num_followers";

export const getUser = `query {
  currentuser (limit: 1) { 
    ${fields} 
    ${privateFields}
  }
}`;

export const getUserByUsername = `query($username: String!) {
  users(where: { username: {_eq: $username }}, limit: 1) { 
    ${fields} 
    ${computed}
    holdings {
      ${artworkFields} 
    } 
    creations {
      ${artworkFields} 
    } 
    offers {
      transaction {
        ${txFields}
        artwork {
          ${artworkFields}
        } 
      }
    } 
    favorites {
      artwork {
        ${artworkFields}
      }
    } 
  }
}`;

export const getSamples = `query {
  users(where: { _and: [{ is_artist: { _eq: false }, is_denied: { _eq: false }}, { samples: {}}]}) {
    ${fields} 
    info
    samples {
      id
      url
      type
    } 
  }
}`;

export const updateUser = `mutation update_user($user: users_set_input!, $id: uuid!) {
  update_users_by_pk(pk_columns: { id: $id }, _set: $user) {
    ${fields}
    wallet_initialized
    ${computed}
  }
}`;

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
  users(order_by: { username: asc }) {
    id
    address
    multisig
    username
    avatar_url
  }
}`;
