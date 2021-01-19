const wretch = require("wretch");
const fetch = require("node-fetch");
const FormData = require("form-data");

console.log(new Date());

wretch().polyfills({
  fetch: fetch,
  FormData: FormData,
  URLSearchParams: require("url").URLSearchParams,
});

const { ESPLORA_URL, SECRET, HASURA_URL } = process.env;

const api = wretch()
  .url(HASURA_URL)
  .headers({ "x-hasura-admin-secret": SECRET });
const esplora = wretch().url(ESPLORA_URL);

const query = `
  query transactions {
    transactions(where: {
      confirmed: {_eq: false},
      type: {_eq: "purchase"},
    }) {
      id
      hash
    }
  }
`;

const setConfirmed = `
  mutation setConfirmed($id: uuid!) {
    update_transactions_by_pk(
      pk_columns: { id: $id }, 
      _set: { 
        confirmed: true
      }
    ) {
      id
      user_id
      artwork_id
    }
  }
`;

const updateArtwork = `
  mutation updateArtwork($id: uuid!, $owner_id: uuid!) {
    update_artworks_by_pk(
      pk_columns: { id: $id }, 
      _set: { 
        owner_id: $owner_id,
        reserve_price: null,
        list_price: null,
        list_price_tx: null,
        auction_start: null,
        auction_end: null,
        asking_asset: null
      }
    ) {
      id
    }
  }
`;

setInterval(
  async () =>
    api
      .post({ query })
      .json(({ data: { transactions } }) =>
        transactions.map((tx) =>
          esplora
            .url(`/tx/${tx.hash}/status`)
            .get()
            .json(
              ({ confirmed }) =>
                confirmed &&
                api
                  .post({ query: setConfirmed, variables: { id: tx.id } })
                  .json(
                    ({ data: { update_transactions_by_pk: transaction } }) => {
                      console.log(transaction);
                      api
                        .post({
                          query: updateArtwork,
                          variables: {
                            id: transaction.artwork_id,
                            owner_id: transaction.user_id,
                          },
                        })
                        .json(console.log);
                    }
                  )
            )
            .catch(console.log)
        )
      )
      .catch(console.log),
  2000
);
