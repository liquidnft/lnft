import { fields as txfields } from "./transactions";

const defaultFields = `
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
  royalty
  slug
  is_physical
  instagram
  ticker
  views
  transferred_at
  locked_content
  owner {
    id
    username
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

export const getFeatured = `query {
 featured {
    id
    start_date
    end_date
    white 
    artwork {
      ${defaultFields}
    } 
  }
}`;

export const getArtworks = `query($where: artworks_bool_exp!, $limit: Int, $offset: Int, $order_by: artworks_order_by!) {
 artworks(where: $where, limit: $limit, offset: $offset, order_by: [$order_by]) {
    ${defaultFields}
    tags {
      tag
    } 
  }
}`;

export const getUserArtworks = (id) => `query {
 artworks(where: { _or: [{ artist_id: { _eq: "${id}" }}, { owner_id: { _eq: "${id}" }}]}) {
    ${defaultFields}
    tags {
      tag
    } 
  }
}`;

export const getArtworksByOwner = (id) => `query {
 artworks(where: { owner_id: { _eq: "${id}" }}) {
    ${defaultFields}
    tags {
      tag
    } 
  }
}`;

export const getArtworkByAsset = (asset) => `query {
  artworks(where: {asset: {_eq: "${asset}"}}, limit: 1) {
    ${defaultFields}
  }
}`;

export const getArtworkBySlug = (slug) => `query {
  artworks(where: {slug : {_eq: "${slug}"}}, limit: 1) {
    ${defaultFields}
  }
}`;

export const getArtworksByArtist = (id) => `query {
  artworks(where: {artist_id: {_eq: "${id}"}}) {
    ${defaultFields}
  }
}`;

export const getArtworksByUsername = (username) => `query {
  artworks(where: {artist: { username: {_eq: "${username}"}}}) {
    ${defaultFields}
  }
}`;

export const getArtworksByTag = (tag) => `query {
  artworks(where: {tags: {tag: {_eq: "${tag}"}}}) {
    ${defaultFields}
  }
}`;

export const create = `mutation ($artwork: artworks_insert_input!, $tags: [tags_insert_input!]!, $transaction: transactions_insert_input!) {
  insert_artworks_one(object: $artwork) {
    ${defaultFields}
    tags {
      tag
    } 
  }
  insert_tags(objects: $tags) {
    affected_rows
  }
  insert_transactions_one(object: $transaction) {
    ${txfields}
  } 
}`;

export const updateArtwork = `mutation update_artwork($artwork: artworks_set_input!, $id: uuid!) {
  update_artworks_by_pk(pk_columns: { id: $id }, _set: $artwork) {
    id
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

export const getArtwork = (id, fields = defaultFields) => `query {
  artworks_by_pk(id: "${id}") {
    ${fields}
    tags {
      tag
    },
    num_favorites,
    favorites_aggregate(where: {artwork_id: {_eq: "${id}"}}) {
      aggregate {
        count
      }
    }
  }
}`;

export const countArtworks = `query($where: artworks_bool_exp!, $order_by: artworks_order_by!) {
  artworks_aggregate(where: $where, order_by: [$order_by]) {
    aggregate {
      count
    }
  }
}`;

export const getTags = `query {
  tags {
    tag
    artwork {
      ${defaultFields}
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
