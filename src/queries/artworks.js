const fields = `
  id,
  asset
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
  bid {
    user {
      id
      username
    } 
    amount 
  } 
`;

export const getAssets = `subscription {
 artworks {
   title
   asset
 }
}`;

export const getArtworks = `subscription {
 artworks {
    ${fields}
    tags {
      tag
    } 
  }
}`;

export const getArtworksByArtist = (id) => `subscription {
  artworks(where: {artist_id: {_eq: "${id}"}}) {
    ${fields}
  }
}`;

export const getArtworksByTag = (tag) => `subscription {
  artworks(where: {tags: {tag: {_eq: "${tag}"}}}) {
    ${fields}
  }
}`;

export const create = {
  query: `mutation insert_single_artwork($artwork: artworks_insert_input!, $tags: [tags_insert_input!]!, $transaction: transactions_insert_input!) {
      insert_artworks_one(object: $artwork) {
        id
      }
      insert_tags(objects: $tags) {
        affected_rows
      }
      insert_transactions_one(object: $transaction) {
        id
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

export const getArtwork = (id) => `subscription {
  artworks_by_pk(id: "${id}") {
    ${fields}
    artist {
      address
      username
      avatar_url
    },
    owner {
      username
      avatar_url
      address
      pubkey
    },
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

export const getTags = `subscription {
  tags {
    tag
    artwork {
      ${fields}
    } 
  } 
}`;
