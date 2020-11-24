import { gql } from "$lib/api";

export const createTransaction = {
  query: `mutation create_transaction($transaction: transactions_insert_input!) {
    insert_transactions_one(object: $transaction) {
      id,
      artwork_id
    } 
  }`,
};

export const getOffers = (token) =>
  new Promise((resolve) =>
    gql
      .auth(`Bearer ${token}`)
      .post({
        query: `query {
          offers {
            amount 
            artwork {
              id
              title
              filename
              bid {
                amount
                user {
                  id
                  username
                } 
              } 
            } 
          }
        }`,
      })
      .json((r) => resolve(r.data.offers))
  );

export const acceptOffer = (token, transaction) =>
  gql.auth(`Bearer ${token}`).post({
    query: `mutation update_artwork {
      update_artworks_by_pk(
        pk_columns: { id: "${transaction.artwork.id}" }, 
        _set: { 
          owner_id: "${transaction.artwork.bid[0].user.id}", 
          list_price: 0
        }
      ) {
        id
      }
    }`,
  });
