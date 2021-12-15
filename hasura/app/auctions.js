const { api, hasura } = require("./api");
const { formatISO, compareAsc, parseISO } = require("date-fns");
const { combine, release, sign, broadcast } = require("./wallet");
const { check } = require("./signing");

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

setInterval(async () => {
  try {
    const query = `query {
      artworks(where: { _and: [
          { auction_end: { _lte: "${formatISO(new Date())}"}}, 
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

    let res = await hasura.post({ query }).json();
    let { data, errors } = res;
    if (errors) throw new Error(errors[0].message);
    let { artworks } = data;

    for (let i = 0; i < artworks.length; i++) {
      let artwork = artworks[i];
      let { bid } = artwork;

      hasura
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
        .json()
        .catch(console.log);

      console.log("finalizing auction for", artwork.slug);
      console.log("reserve price", artwork.reserve_price);

      try {
        if (
          !(bid && bid.psbt) ||
          compareAsc(parseISO(bid.created_at), parseISO(artwork.auction_end)) >
            0 ||
          bid.amount < artwork.reserve_price
        )
          throw new Error("no bid");

        let combined = combine(artwork.auction_tx, bid.psbt);

        await check(combined);

        let psbt = await sign(combined);
        await broadcast(psbt);

        await hasura
          .post({
            query: releaseQuery,
            variables: {
              id: artwork.id,
              owner_id: bid.user.id,
              amount: bid.amount,
              hash: psbt.extractTransaction().getId(),
              psbt: psbt.toBase64(),
              asset: artwork.asking_asset,
              bid_id: bid.id,
              type: "release",
            },
          })
          .json();

        console.log("released to high bidder");
      } catch (e) {
        console.log("couldn't release to bidder,", e.message);
        if (artwork.has_royalty) continue;

        try {
          let psbt = await sign(artwork.auction_release_tx);
          await broadcast(psbt);

          console.log("released to current owner");

          let result = await hasura
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

          if (result.errors && result.errors.length)
            throw new Error(JSON.stringify(result.errors[0].message));
        } catch (e) {
          console.log("problem releasing", e);
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
}, 2000);
