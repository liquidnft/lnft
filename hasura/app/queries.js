module.exports = {
  getTransactionUser: `query($id: uuid!) {
    transactions_by_pk(id: $id) {
      user_id
    }
  }`,
  getUserByAddress: `query($address: String!) {
    users(where: { _or: [{ address: { _eq: $address }}, { multisig: { _eq: $address }}]}) {
      id
      address
      multisig
    }
  }`,
  getCurrentUser: `query {
    currentuser {
      id
      address
      multisig
      display_name
      full_name
    }
  }`,
  cancelBid: `mutation ($id: uuid!) {
    update_transactions_by_pk(
      pk_columns: { id: $id },
      _set: {
        type: "cancelled_bid"
      }
    ) {
     id
    }
  }`,
  createUtxo: `mutation create_utxo($utxo: utxos_insert_input!) {
    insert_utxos_one(object: $utxo) {
      id
    }
  }`,
  createTransaction: `mutation create_transaction($transaction: transactions_insert_input!) {
    insert_transactions_one(object: $transaction) {
      id
    }
  }`,
  deleteUtxo: `mutation delete_utxo($id: uuid!) {
    delete_utxos_by_pk(id: $id) {
      id
    }
  }`,
  updateViews: `mutation ($id: uuid!) {
    update_artworks_by_pk(pk_columns: { id: $id }, _inc: { views: 1 }) {
      id
      owner {
        address
        multisig
      }
      asset
    }
  }`,
  setHeld: `mutation ($id: uuid!, $held: String!) {
    update_artworks_by_pk(pk_columns: { id: $id }, _set: { held: $held }) {
      id
      owner {
        address
        multisig
      }
      asset
    }
  }`,
  setOwner: `mutation($id: uuid!, $owner_id: uuid!) {
    update_artworks_by_pk(
      pk_columns: { id: $id },
      _set: {
        owner_id: $owner_id,
      }
    ) {
      id
    }
  }`,
  getTransactionArtwork: `query($id: uuid!) {
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
  }`,
  setRelease: `mutation($id: uuid!, $psbt: String!) {
    update_artworks_by_pk(
      pk_columns: { id: $id },
      _set: {
        auction_release_tx: $psbt,
      }
    ) {
      id
    }
  }`,
  setPsbt: `mutation update_transaction($id: uuid!, $psbt: String!) {
    update_transactions_by_pk(
      pk_columns: { id: $id },
      _set: {
        psbt: $psbt,
      }
    ) {
      id
    }
  }`,
  acceptBid: `mutation update_artwork(
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
  }`,
  updateUser: `mutation update_user($user: users_set_input!, $id: uuid!) {
    update_users_by_pk(pk_columns: { id: $id }, _set: $user) {
      id
    }
  }`,
  getUser: `query get_user_by_pk($id: uuid!) {
    users_by_pk(id: $id) {
      display_name
      full_name
    }
  }`,
  getAvatars: `query { users { id, avatar_url }}`,
  getActiveBids: `query {
    activebids(where: { type: { _eq: "bid" }}) {
      id
      artwork_id
      psbt
    }
  }`,
  getActiveListings: `query {
    activelistings {
      id
      artwork_id
      psbt
    }
  }`,
  cancelListing: `mutation ($id: uuid!, $artwork_id: uuid!) {
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
  }`,
  getUnconfirmed: `query {
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
  }`,
  setTransactionTime: `mutation($id: uuid!, $created_at: timestamptz!) {
    update_transactions_by_pk(
      pk_columns: { id: $id }, 
      _set: { created_at: $created_at }
    ) {
      id
    }
  }`,
  getLastTransaction: `query($artwork_id: uuid!) { 
    transactions(
      where: { artwork_id: { _eq: $artwork_id }, confirmed: { _eq: true }},
      order_by: { created_at: desc }, 
      limit: 1
    ) {
      created_at
    }
  }`,
  getContract: `query transactions($asset: String!) {
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
  }`,
  getLastTransactionsForAddress: `query($address: String!) {
    transactions(
      where: {
        address: {_eq: $address}, 
        type: {_in: ["deposit", "withdrawal"]}
      },
      limit: 25,
      order_by: [{ sequence: desc }]
    ) {
      hash
      type
      asset
      address
      user_id
    }
  }`,
  getTransactions: `query($id: uuid!, $limit: Int) {
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
  }`,
  setConfirmed: `mutation setConfirmed($id: uuid!) {
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
  }`,
  getArtworkWithBidTransactionByHash: `query getArtworkWithBidTransactionByHash($id: uuid!, $hash: String!) {
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
  }`,
  getArtworkByPk: `query getArtworkByPk($id: uuid!) {
    artworks_by_pk(id: $id) {
      id
      title
      slug
      list_price
    }
  }`,
  getUtxos: `query($address: String!) {
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
  }`,
};
