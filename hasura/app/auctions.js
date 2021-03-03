const { api, hasura } = require("./api");
const { formatISO } = require("date-fns");
const { sign, broadcast } = require("./wallet");

const acceptOffer = `mutation update_artwork($id: uuid!, $owner_id: uuid!, $amount: Int!, $psbt: String!, $asset: String!, $hash: String!, $bid_id: uuid) {
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

    let psbt = await sign(artwork.list_price_tx);
    try {
      await broadcast(psbt);
    } catch (e) {}

    await hasura
      .post({
        query: acceptOffer,
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
      .json()
  }
}, 2000);
