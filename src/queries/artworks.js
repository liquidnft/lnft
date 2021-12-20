export const marketFields = `
  id
  edition
  editions
  title
  filename
  filetype
  favorited
  list_price
  auction_start
  auction_end
  asking_asset
  has_royalty
  slug
  views
  created_at
  owner {
    id
    username
    avatar_url
  },
  artist {
    id
    username
    avatar_url
  },
  bid {
    id
    user {
      id
      username
    } 
    amount 
  }
`

export const fields = `
  id,
  asset
  edition
  editions
  held
  title
  description
  artist_id
  owner_id
  filename
  filetype
  favorited
  list_price
  reserve_price
  last_active
  created_at
  auction_start
  auction_end
  list_price_tx
  asking_asset
  bid_increment
  extension_interval
  max_extensions
  has_royalty
  royalty_recipients {
    id
    name
    artwork_id
    asking_asset
    amount
    address
    type
  }
  slug
  is_physical
  instagram
  ticker
  views
  transferred_at
  owner {
    id
    username
    full_name
    email
    avatar_url
    address
    pubkey
  },
  artist {
    id
    address
    username
    avatar_url
  },
  bid {
    id
    user {
      id
      username
    } 
    amount 
  }
`;

export const txFields = `
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
    full_name
    email
  } 
  artwork_id
  artwork {
    ${fields}
  } 
`;


export const getFeatured = `query {
 featured {
    id
    start_date
    end_date
    white 
    artwork {
      ${fields}
    } 
  }
}`;

export const getLimited = `query($where: artworks_bool_exp!, $limit: Int, $offset: Int, $order_by: artworks_order_by!) {
 artworks(where: $where, limit: $limit, offset: $offset, order_by: [$order_by]) {
    ${marketFields}
    tags {
      tag
    } 
  }
}`;

export const getArtworks = `query($where: artworks_bool_exp!, $limit: Int, $offset: Int, $order_by: artworks_order_by!) {
 artworks(where: $where, limit: $limit, offset: $offset, order_by: [$order_by]) {
    ${fields}
    tags {
      tag
    } 
  }
}`;

export const getUserArtworks = `query($id: uuid!) {
 artworks(where: { _or: [{ artist_id: { _eq: $id }}, { owner_id: { _eq: $id }}, { favorited: { _eq: true }}]}) {
    ${fields}
    tags {
      tag
    } 
  }
}`;

export const getArtworksByOwner = (id) => `query {
 artworks(where: { owner_id: { _eq: "${id}" }}) {
    ${fields}
    tags {
      tag
    } 
  }
}`;

export const getArtworkByAsset = (asset) => `query {
  artworks(where: {asset: {_eq: "${asset}"}}, limit: 1) {
    ${fields}
  }
}`;

export const getArtworkBySlug = `query($slug: String!) {
  artworks(where: {slug : {_eq: $slug}}, limit: 1) {
    ${fields}
    transactions(where: { type: { _neq: "royalty" }}, order_by: { created_at: desc }) {
      ${txFields}
    } 
    tags {
      tag
    },
    num_favorites,
  }
}`;

export const getArtworksByArtist = `query($id: uuid!, $limit: Int) {
  artworks(where: {artist_id: {_eq: $id}}, limit: $limit) {
    ${fields}
  }
}`;

export const getArtworksByUsername = (username) => `query {
  artworks(where: {artist: { username: {_eq: "${username}"}}}) {
    ${fields}
  }
}`;

export const getArtworksByTag = (tag) => `query {
  artworks(where: {tags: {tag: {_eq: "${tag}"}}}) {
    ${fields}
  }
}`;

export const create = `mutation ($artwork: artworks_insert_input!, $tags: [tags_insert_input!]!, $transaction: transactions_insert_input!) {
  insert_artworks_one(object: $artwork) {
    ${fields}
    tags {
      tag
    } 
  }
  insert_tags(objects: $tags) {
    affected_rows
  }
  insert_transactions_one(object: $transaction) {
    ${txFields}
  } 
}`;

export const updateArtwork = `mutation update_artwork($artwork: artworks_set_input!, $id: uuid!) {
  update_artworks_by_pk(pk_columns: { id: $id }, _set: $artwork) {
    id
  }
}`;

export const updateArtworkWithRoyaltyRecipients = `mutation update_artwork_with_royalty_recipients($artwork: artworks_set_input!, $id: uuid!, $royaltyRecipients: [royalty_recipients_insert_input!]!) {
  update_artworks_by_pk(pk_columns: { id: $id }, _set: $artwork) {
    id
  }
  delete_royalty_recipients(where: {artwork_id: {_eq: $id}}) {
    affected_rows
  }
  insert_royalty_recipients(objects: $royaltyRecipients) {
    affected_rows
  }
}`;

export const updateTags = `mutation insert_tags($tags: [tags_insert_input!]!, $artwork_id: uuid!) {
  delete_tags(where: {artwork_id: {_eq: $artwork_id}}) {
    affected_rows
  } 
  insert_tags(objects: $tags) {
    affected_rows
  }
}`;

export const getArtwork = `query($id: uuid!) {
  artworks_by_pk(id: $id) {
    ${fields}
    tags {
      tag
    },
    num_favorites,
    transactions(where: { type: { _neq: "royalty" }}, order_by: { created_at: desc }) {
      ${txFields}
    } 
    favorites_aggregate(where: {artwork_id: {_eq: $id}}) {
      aggregate {
        count
      }
    }
  }
}`;

export const countArtworks = `query($where: artworks_bool_exp!) {
  artworks_aggregate(where: $where) {
    aggregate {
      count
    }
  }
}`;

export const getTags = `query {
  tags {
    tag
    artwork {
      ${fields}
    } 
  } 
}`;

export const getTitles = `query {
  artworks {
    id
    asset
    edition
    editions
    title
    owner_id
  }
}`;
