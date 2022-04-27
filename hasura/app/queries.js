export const getTransactionUser = `query($id: uuid!) {
  transactions_by_pk(id: $id) {
    user_id
  }
}`;

export const getUserByAddress = `query($address: String!) {
  users(where: { _or: [{ address: { _eq: $address }}, { multisig: { _eq: $address }}]}) {
    id
    address
    multisig
  }
}`;

export const getCurrentUser = `query {
  currentuser {
    id
    address
    multisig
    display_name
    full_name
  }
}`;

export const cancelBid = `mutation ($id: uuid!) {
  update_transactions_by_pk(
    pk_columns: { id: $id },
    _set: {
      type: "cancelled_bid"
    }
  ) {
   id
  }
}`;

export const cancelBids = `mutation ($artwork_id: uuid!, $start: timestamptz!, $end: timestamptz!) {
  update_transactions(where: { artwork_id: { _eq: $artwork_id }, created_at: { _gte: $start, _lte: $end }},
    _set: {
      type: "cancelled_bid"
    }
  ) {
    affected_rows
  }
}`;

export const createUtxo = `mutation create_utxo($utxo: utxos_insert_input!) {
  insert_utxos_one(object: $utxo) {
    id
  }
}`;

export const createTransaction = `mutation create_transaction($transaction: transactions_insert_input!) {
  insert_transactions_one(object: $transaction) {
    id
  }
}`;

export const deleteUtxo = `mutation delete_utxo($id: uuid!) {
  delete_utxos_by_pk(id: $id) {
    id
  }
}`;

export const updateArtwork = `mutation ($artwork: artworks_set_input!, $id: uuid!) {
  update_artworks_by_pk(pk_columns: { id: $id }, , _set: $artwork) {
    id
  }
}`;

export const updateViews = `mutation ($id: uuid!) {
  update_artworks_by_pk(pk_columns: { id: $id }, _inc: { views: 1 }) {
    id
    owner {
      address
      multisig
    }
    asset
  }
}`;

export const deleteTransaction = `mutation delete_transaction($id: uuid!) {
  delete_transactions_by_pk(id: $id) {
    id
  }
}`;

export const setHeld = `mutation ($id: uuid!, $held: String!) {
  update_artworks_by_pk(pk_columns: { id: $id }, _set: { held: $held }) {
    id
    owner {
      address
      multisig
    }
    asset
  }
}`;

export const setOwner = `mutation($id: uuid!, $owner_id: uuid!) {
  update_artworks_by_pk(
    pk_columns: { id: $id },
    _set: {
      owner_id: $owner_id,
    }
  ) {
    id
  }
}`;

export const getTransactionArtwork = `query($id: uuid!) {
  artworks(where: { id: { _eq: $id }}) {
    id
    auction_start
    auction_end
    bid_increment
    owner {
      id
      display_name
    }
    title
    slug
    bid {
      amount
      user {
        id
        display_name
      }
    }
  }
}`;

export const setRelease = `mutation($id: uuid!, $psbt: String!) {
  update_artworks_by_pk(
    pk_columns: { id: $id },
    _set: {
      auction_release_tx: $psbt,
    }
  ) {
    id
  }
}`;

export const setPsbt = `mutation update_transaction($id: uuid!, $psbt: String!) {
  update_transactions_by_pk(
    pk_columns: { id: $id },
    _set: {
      psbt: $psbt,
      bid_id: $bid_id,
    }
  ) {
    id,
    artwork_id
  }
}`;

export const acceptBid = `mutation update_artwork(
  $id: uuid!,
  $owner_id: uuid!,
  $amount: Int!,
  $psbt: String!,
  $asset: String!,
  $hash: String!,
  $bid_id: uuid
) {
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
}`;

export const updateUser = `mutation update_user($user: users_set_input!, $id: uuid!) {
  update_users_by_pk(pk_columns: { id: $id }, _set: $user) {
    id
  }
}`;

export const getUser = `query get_user_by_pk($id: uuid!) {
  users_by_pk(id: $id) {
    display_name
    full_name
  }
}`;

export const getAvatars = `query { users { id, avatar_url }}`;

export const getActiveBids = `query {
  activebids(where: { type: { _eq: "bid" }}) {
    id
    artwork_id
    psbt
  }
}`;

export const getActiveListings = `query {
  activelistings {
    id
    artwork_id
    psbt
  }
}`;

export const cancelListing = `mutation ($id: uuid!, $artwork_id: uuid!) {
  update_artworks_by_pk(
    pk_columns: { id: $artwork_id }, 
    _set: { 
      list_price: null,
      list_price_tx: null
    }
  ) {
   id
  }
  update_transactions_by_pk(
    pk_columns: { id: $id }, 
    _set: { 
      type: "cancelled_listing"
    }
  ) {
   id
  }
}`;

export const getUnconfirmed = `query {
  transactions(
    where: {
      confirmed: {_eq: false},
      type: {_in: ["purchase", "creation", "royalty", "accept", "release", "auction", "cancel", "deposit", "withdrawal"] },
    }
  ) {
    id
    hash
    bid {
      id
    } 
  }
}`;

export const setTransactionTime = `mutation($id: uuid!, $created_at: timestamptz!) {
  update_transactions_by_pk(
    pk_columns: { id: $id }, 
    _set: { created_at: $created_at }
  ) {
    id
  }
}`;

export const getLastTransaction = `query($artwork_id: uuid!) { 
  transactions(
    where: { artwork_id: { _eq: $artwork_id }, confirmed: { _eq: true }},
    order_by: { created_at: desc }, 
    limit: 1
  ) {
    created_at
  }
}`;

export const getContract = `query transactions($asset: String!) {
  transactions(where: {
    _and: [{
        artwork: {
          asset: { _eq: $asset }
        }
      },
      {
        type: {
          _eq: "creation"
        }
      }
    ]
  }) {
    contract
  } 
}`;

export const getLastTransactionsForAddress = `query($address: String!) {
  transactions(
    where: {
      address: {_eq: $address}, 
      type: {_in: ["deposit", "withdrawal"]}
    },
    order_by: [{ sequence: desc }]
  ) {
    hash
    type
    asset
    address
    user_id
  }
}`;

export const getTransactions = `query($id: uuid!, $limit: Int) {
  transactions(
    where: {
      user_id: {_eq: $id}, 
      type: {_in: ["deposit", "withdrawal"]}
    },
    order_by: {sequence: desc}, 
    limit: $limit
  ) {
    id
    hash
    amount
    created_at
    sequence
    asset
    type
    json
    hex
    user_id
    address
    confirmed
  }
}`;

export const setConfirmed = `mutation setConfirmed($id: uuid!) {
  update_transactions_by_pk(
    pk_columns: { id: $id }, 
    _set: { 
      confirmed: true
    }
  ) {
    id
    user_id
    artwork_id
    hash
    psbt
    type
    asset
    contract
    artwork {
      owner_id
      editions
      asset
    }
    user {
      username
    } 
    bid {
      id
      user_id
    } 
  }
}`;

export const getArtworkWithBidTransactionByHash = `query getArtworkWithBidTransactionByHash($id: uuid!, $hash: String!) {
  artworks_by_pk(id: $id) {
    id
    title
    slug
    owner {
      full_name
      display_name
    }
    transactions(where:{type:{_eq:"bid"}}) {
      amount
      user{
        display_name
        full_name
      }
    }
  }
  transactions(where: {hash:{_eq: $hash}, type: {_eq: "bid"}}){
    id
    type
    amount
  }
}`;

export const getArtwork = `query($id: uuid!) {
  artworks_by_pk(id: $id) {
    id
    owner {
      address
      multisig
    } 
    owner_id
    asset
    title
    slug
    list_price
  }
}`;

export const getUtxos = `query($address: String!) {
  utxos(where: { address: { _eq: $address }}, order_by: [{ tx: { sequence: desc }}]) {
    id
    transaction_id
    tx {
      hash
      hex
      created_at
      sequence
      confirmed
    }
    vout
    asset
    value
  }
}`;

export const getTransferTransactionsByPsbt = `query($psbt: String!) {
  transactions(
    where: {
      psbt: {_eq: $psbt}, 
      type: {_eq: "transfer"}
    },
    limit: 1
  ) {
    id
    amount
    user_id
  }
}`;

export const createArtwork = `mutation($artwork: artworks_insert_input!, $tags: [tags_insert_input!]!, $transaction: transactions_insert_input!) {
  insert_artworks_one(object: $artwork) {
    id
  }
  insert_tags(objects: $tags) {
    affected_rows
  }
  insert_transactions_one(object: $transaction) {
    id
  } 
}`;

export const createComment = `mutation($comment: comments_insert_input!) {
  insert_comments_one(object: $comment) {
    id
  }
}`;

export const getUserByEmail = `query($email: String!) {
  users(where: {_or: [{display_name: {_eq: $email}}, {username: {_eq: $email }}]}, limit: 1) {
    display_name
  }
}`;

export const updateUserByEmail = `mutation($user: users_set_input!, $email: String!) {
  update_users(where: {display_name: {_eq: $email}}, _set: $user) {
    affected_rows 
  }
}`;

export const deleteUserByEmail = `mutation($email: String!) { 
  delete_users(where: { account: { email: { _eq: $email } } }) 
  { 
    affected_rows 
  } 
}`;

export const closeAuction = `mutation update_artwork($id: uuid!, $artwork: artworks_set_input!) {
  update_artworks_by_pk(
    pk_columns: { id: $id }, 
    _set: $artwork
  ) {
    id
  }
}`;

export const releaseToken = `mutation update_artwork($id: uuid!, $owner_id: uuid!, $amount: Int!, $psbt: String!, $asset: String!, $hash: String!, $bid_id: uuid, $type: String!) {
  update_artworks_by_pk(
    pk_columns: { id: $id }, 
    _set: { 
      owner_id: $owner_id,
      auction_release_tx: null,
      auction_tx: null,
      reserve_price: null,
    }
  ) {
    id
  }
  insert_transactions_one(object: {
    artwork_id: $id,
    asset: $asset,
    type: $type,
    amount: $amount,
    hash: $hash,
    psbt: $psbt,
    bid_id: $bid_id,
    user_id: $owner_id,
  }) {
    id,
    artwork_id
  } 
}`;

export const getFinishedAuctions = `query($now: timestamptz!) {
  artworks(where: { _and: [
      { auction_end: { _lte: $now }}, 
      { auction_tx: { _is_null: false }}
    ]}) {
    id
    title
    slug
    filename
    filetype
    reserve_price
    asking_asset
    has_royalty
    auction_end
    transferred_at
    list_price_tx
    auction_tx
    auction_release_tx
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
      psbt
      user {
        id
        username
      } 
    } 
  } 
}`;
