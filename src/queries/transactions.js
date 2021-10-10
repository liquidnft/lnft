export const createTransaction = `mutation create_transaction($transaction: transactions_insert_input!) {
  insert_transactions_one(object: $transaction) {
    id,
    artwork_id
  } 
}`;

const artworkfields = `
  id
  asset
  title
  filename
  filetype
  asking_asset
  royalty
  auction_start
  auction_end
  transferred_at
  slug
  artist_id
  owner_id
  artist {
    id
    username
    avatar_url
    address
  } 
  owner {
    id
    username
    avatar_url
    address
    pubkey
  } 
  bid {
    id
    amount
    user {
      id
      username
    } 
  } 
`;

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
  artwork {
    ${artworkfields}
  } 
`;

export const getArtworkTransactions = (id) => `query {
  transactions(order_by: {created_at: desc}, where: {_and: {artwork_id: {_eq: "${id}"}}}) {
    ${fields}
  }
}`;

export const getTransaction = (id) => `query {
  transactions_by_pk(id: "${id}") {
    ${fields}
  }
}`;

export const getTransactions = (limit = 10) => `query {
  transactions(where: {artwork_id: {_is_null: false}}, order_by: {created_at: desc}, limit: ${limit}) {
    ${fields}
  }
}`;

export const getActiveBids = (id) => `query {
  activebids(where: { user_id: { _eq: "${id}"}}) {
    id
    psbt
    amount
    type
    artwork {
      ${artworkfields}
    } 
  }
}`;

export const getRecentActivity = (limit = 3) => `query {
  recentactivity(limit: ${limit}) {
    ${fields}
  }
}`;

export const getLatestPieces = (limit = 3) => `query {
  transactions(where: {artwork_id: {_is_null: false}, type: {_eq: "creation"}}, order_by: [{created_at: desc}], limit: ${limit}) {
    ${fields}
  }
}`;

export const getOffers = `query {
  offers {
    transaction {
      ${fields}
    }
  }
}`;
