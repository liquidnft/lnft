import { fields as txfields } from "./transactions";

const fields = `
  id,
  asset
  edition
  editions
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

export const getAssets = `subscription {
 artworks {
   id
   title
   asset
   auction_end
   royalty
 }
}`;

export const getArtworks = `query {
 artworks {
    ${fields}
    tags {
      tag
    } 
  }
}`;

export const subscribeArtworks = `subscription {
 artworks {
    ${fields}
    tags {
      tag
    } 
  }
}`;

export const getUserArtworks = (id) => `query {
 artworks(where: { _or: [{ artist_id: { _eq: "${id}" }}, { owner_id: { _eq: "${id}" }}]}) {
    ${fields}
    tags {
      tag
    } 
  }
}`;

export const getArtworksByOwner = (id) => `query {
 artworks(where: { { owner_id: { _eq: "${id}" }}}) {
    ${fields}
    tags {
      tag
    } 
  }
}`;

export const getArtworkByAsset = (asset) => `subscription {
  artworks(where: {asset: {_eq: "${asset}"}}, limit: 1) {
    ${fields}
  }
}`;

export const getArtworkBySlug = (slug) => `query {
  artworks(where: {slug : {_eq: "${slug}"}}, limit: 1) {
    ${fields}
  }
}`;

export const getArtworksByArtist = (id) => `query {
  artworks(where: {artist_id: {_eq: "${id}"}}) {
    ${fields}
  }
}`;

export const getArtworksByUsername = (username) => `subscription {
  artworks(where: {artist: { username: {_eq: "${username}"}}}) {
    ${fields}
  }
}`;

export const getArtworksByTag = (tag) => `subscription {
  artworks(where: {tags: {tag: {_eq: "${tag}"}}}) {
    ${fields}
  }
}`;

export const create = {
  query: `mutation insertArtwork($artwork: artworks_insert_input!, $tags: [tags_insert_input!]!, $transaction: transactions_insert_input!) {
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
        ${txfields}
      } 
    }`,
};

export const updateArtwork = {
  query: `mutation update_artwork($artwork: artworks_set_input!, $id: uuid!) {
      update_artworks_by_pk(pk_columns: { id: $id }, _set: $artwork) {
        id
      }
    }`,
};

export const updateTags = {
  query: `mutation insert_tags($tags: [tags_insert_input!]!, $artwork_id: uuid!) {
      delete_tags(where: {artwork_id: {_eq: $artwork_id}}) {
        affected_rows
      } 
      insert_tags(objects: $tags) {
        affected_rows
      }
    }`,
};

export const destroyArtwork = (artwork) => ({
  query: `mutation {
      delete_artworks_by_pk(id: "${artwork.id}") {
        id
      }
    }`,
});

export const getArtworkSub = (id) => `subscription {
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

export const getArtwork = (id) => `query {
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

export const getTags = `query {
  tags {
    tag
    artwork {
      ${fields}
    } 
  } 
}`;
