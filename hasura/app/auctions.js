const { api, hasura } = require("./api");
const { formatISO } = require("date-fns");
const { combine, sign, broadcast } = require("./wallet");

const close = `mutation update_artwork($id: uuid!, $artwork: artworks_set_input!) {
  update_artworks_by_pk(
    pk_columns: { id: $id }, 
    _set: $artwork
  ) {
    id
  }
}`;

const release = `mutation update_artwork($id: uuid!, $owner_id: uuid!, $amount: Int!, $psbt: String!, $asset: String!, $hash: String!, $bid_id: uuid) {
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
    type: "release",
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

setInterval(async () => {
  const query = `query {
    artworks(where: { auction_end: { _lte: "${formatISO(new Date())}"}}) {
      id
      title
      filename
      filetype
      asking_asset
      royalty
      auction_end
      transferred_at
      list_price_tx
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

  let { artworks } = (await hasura.post({ query }).json()).data;
  for (let i = 0; i < artworks.length; i++) {
    let artwork = artworks[i];

    try {
      if (!artwork.bid[0].psbt) throw new Error();

      let combined = combine(artwork.list_price_tx, artwork.bid[0].psbt);
      let psbt = await sign(combined);
      await broadcast(psbt);

      await hasura
        .post({
          query: release,
          variables: {
            id: artwork.id,
            owner_id: artwork.bid[0].user.id,
            amount: artwork.bid[0].amount,
            hash: psbt.extractTransaction().getId(),
            psbt: psbt.toBase64(),
            asset: artwork.asking_asset,
            bid_id: artwork.bid[0].id,
          },
        })
        .json();
    } catch (e) {
      console.log("Problem completing auction", e);
      await hasura
        .post({
          query: close,
          variables: {
            id: artwork.id,
            artwork: {
              auction_start: null,
              auction_end: null,
            },
          },
        })
        .json();
    }
  }
}, 2000);
