import { fields as artworkFields } from "./artworks";

export const createTransaction = `mutation create_transaction($transaction: transactions_insert_input!) {
  insert_transactions_one(object: $transaction) {
    id,
    artwork_id
  } 
}`;

export const fields = `
  id
  psbt
  amount 
  hash
  type
  created_at
  asset
  confirmed
  bid {
    id
    user {
      id 
      username
    } 
  } 
  user {
    id
    username
    avatar_url
  } 
  artwork_id
`;

export const getArtworkTransactions = (id) => `query {
  transactions(order_by: {created_at: desc}, where: {_and: {artwork_id: {_eq: "${id}"}}}) {
    ${fields}
    artwork {
      ${artworkFields}
    } 
  }
}`;

export const getTransaction = (id) => `query {
  transactions_by_pk(id: "${id}") {
    ${fields}
    artwork {
      ${artworkFields}
    } 
  }
}`;

export const getTransactions = (limit = 10) => `query {
  transactions(where: {artwork_id: {_is_null: false}}, order_by: {created_at: desc}, limit: ${limit}) {
    ${fields}
    artwork {
      ${artworkFields}
    } 
  }
}`;

export const getActiveBids = (id) => `query {
  activebids(where: { user_id: { _eq: "${id}"}}) {
    id
    psbt
    amount
    type
    artwork {
      ${artworkFields}
    } 
  }
}`;

export const getRecentActivity = (limit = 3) => `query {
  recentactivity(where: { type: { _neq: "royalty" }}, limit: ${limit}) {
    ${fields}
    artwork {
      ${artworkFields}
    } 
  }
}`;

export const getLatestPieces = (limit = 3) => `query {
  transactions(where: {artwork_id: {_is_null: false}, type: {_eq: "creation"}}, order_by: [{created_at: desc}], limit: ${limit}) {
    ${fields}
    artwork {
      ${artworkFields}
    } 
  }
}`;

export const getOffers = `query($id: uuid!) {
  offers(where: { user_id: { _eq: $id }}) {
    transaction {
      ${fields}
      artwork {
        ${artworkFields}
      } 
    }
  }
}`;
