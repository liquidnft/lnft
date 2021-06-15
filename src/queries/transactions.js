export const createTransaction = {
  query: `mutation create_transaction($transaction: transactions_insert_input!) {
    insert_transactions_one(object: $transaction) {
      id,
      artwork_id
    } 
  }`,
};

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
    id
    title
    filename
    filetype
    asking_asset
    royalty
    auction_start
    auction_end
    transferred_at
    slug
    artist {
      id
      username
      avatar_url
    } 
    owner {
      id
      username
      avatar_url
    } 
    bid {
      id
      amount
      user {
        id
        username
      } 
    } 
  } 
`;

export const getArtworkTransactions = (id) => `subscription {
  transactions(order_by: {created_at: desc}, where: {_and: {artwork_id: {_eq: "${id}"}, type: {_neq: "receipt"}}}) {
    ${fields}
  }
}`;

export const getUserTransactions = (id) => `subscription {
  transactions(order_by: {created_at: desc}, where: {user_id: {_eq: "${id}"}}) {
    ${fields}
  }
}`;

export const getTransaction = (id) => `query {
  transactions_by_pk(id: "${id}") {
    ${fields}
  }
}`;

export const getTransactions = (limit = 10) => `query {
  transactions(where: {artwork_id: {_is_null: false}, type: {_neq: "receipt"}}, order_by: {created_at: desc}, limit: ${limit}) {
    ${fields}
  }
}`;

export const getActiveBids = (id) => `query {
  activebids(where: { user_id: { _eq: "${id}"}}) {
    psbt
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

export const acceptOffer = {
  query: `mutation update_artwork($id: uuid!, $owner_id: uuid!, $amount: Int!, $psbt: String!, $asset: String!, $hash: String!, $bid_id: uuid) {
    update_artworks_by_pk(
      pk_columns: { id: $id }, 
      _set: { 
        owner_id: $owner_id,
      }
    ) {
      id
    }
    insert_transactions_one(object: {
      artwork_id: $id,
      asset: $asset,
      type: "accept",
      amount: $amount,
      hash: $hash,
      psbt: $psbt,
      bid_id: $bid_id,
    }) {
      id,
      artwork_id
    } 
  }`,
};
