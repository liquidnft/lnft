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

export const getTransactions = (token) =>
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
              username
            } 
          }
        }`,
      })
      .json((r) => resolve(r.data.offers))
  );
