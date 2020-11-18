import { gql } from "$lib/api";

export const createTransaction = (token, transaction) =>
  gql.auth(`Bearer ${token}`).post({
    query: `mutation create_transaction($transaction: transactions_insert_input!) {
      insert_transactions_one(object: $transaction) {
        id,
        artwork_id
      } 
    }`,
    variables: {
      transaction,
    },
  });

export const getOffers = (token) =>
  new Promise((resolve) =>
    gql
      .auth(`Bearer ${token}`)
      .post({
        query: `query {
          offers {
            bid
            artwork {
              id
              title
              filename
            } 
            user {
              id 
              username
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
          owner_id: "${transaction.user.id}", 
          list_price: 0, 
          bid_price: 0 
        }
      ) {
        id
      }
    }`,
  });
