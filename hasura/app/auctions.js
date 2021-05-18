const { api, hasura } = require("./api");
const { formatISO } = require("date-fns");
const { combine, release, sign, broadcast } = require("./wallet");

const close = `mutation update_artwork($id: uuid!, $artwork: artworks_set_input!) {
  update_artworks_by_pk(
    pk_columns: { id: $id }, 
    _set: $artwork
  ) {
    id
  }
}`;

const releaseQuery = `mutation update_artwork($id: uuid!, $owner_id: uuid!, $amount: Int!, $psbt: String!, $asset: String!, $hash: String!, $bid_id: uuid, $type: String!) {
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

setInterval(async () => {
  try {
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

    let { artworks } = (await hasura.post({ query }).json()).data;
    for (let i = 0; i < artworks.length; i++) {
      let artwork = artworks[i];

      try {
        if (!artwork.bid[0].psbt) throw new Error("No bid");

        let combined = combine(artwork.list_price_tx, artwork.bid[0].psbt);
        let psbt = await sign(combined);
        await broadcast(psbt);

        await hasura
          .post({
            query: releaseQuery,
            variables: {
              id: artwork.id,
              owner_id: artwork.bid[0].user.id,
              amount: artwork.bid[0].amount,
              hash: psbt.extractTransaction().getId(),
              psbt: psbt.toBase64(),
              asset: artwork.asking_asset,
              bid_id: artwork.bid[0].id,
              type: "release",
            },
          })
          .json();
      } catch (e) {
        if (artwork.royalty) return;

        try {
          let psbt = await sign(artwork.auction_release_tx);
          await broadcast(psbt);

          await hasura
            .post({
              query: releaseQuery,
              variables: {
                id: artwork.id,
                owner_id: artwork.owner.id,
                amount: 0,
                hash: psbt.extractTransaction().getId(),
                psbt: psbt.toBase64(),
                asset: artwork.asking_asset,
                type: "return",
              },
            })
            .json();
        } catch (e) {
          console.log("Problem releasing", e);
        }

        /*
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
          */
      }
    }
  } catch (e) {
    console.log(e);
  }
}, 2000);
