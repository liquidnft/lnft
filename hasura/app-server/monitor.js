const { hasura, electrs } = require("./api");

const query = `
  query transactions {
    transactions(where: {
      confirmed: {_eq: false},
      type: {_in: ["purchase", "creation", "royalty", "accept"] },
    }) {
      id
      hash
      bid {
        id
      } 
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
      type
      bid {
        id
        user_id
      } 
    }
  }
`;

const updateArtwork = `
  mutation updateArtwork($id: uuid!, $owner_id: uuid!) {
    update_artworks_by_pk(
      pk_columns: { id: $id }, 
      _set: { 
        owner_id: $owner_id,
      }
    ) {
      id
    }
  }
`;

const acceptOffer = {
  query: `mutation accept_offer($id: uuid!, $owner_id: uuid!, $amount: Int!, $psbt: String!, $asset: String!, $hash: String!) {
    insert_transactions_one(object: {
      artwork_id: $id,
      asset: $asset,
      type: "accept",
      amount: $amount,
      hash: $hash,
      psbt: $psbt,
    }) {
      id,
      artwork_id
    } 
  }`,
};

setInterval(
  async () =>
    hasura
      .post({ query })
      .json(({ data: { transactions } }) =>
        transactions.map((tx) => {
          electrs
            .url(`/tx/${tx.hash}/status`)
            .get()
            .json(({ confirmed }) => {
              confirmed &&
                hasura
                  .post({ query: setConfirmed, variables: { id: tx.id } })
                  .json(
                    ({ data: { update_transactions_by_pk: transaction } }) => {
                      let owner_id;

                      if (transaction.type === "accept")
                        owner_id = transaction.bid.user_id;

                      if (transaction.type === "purchase")
                        owner_id = transaction.user_id;

                      hasura.post({
                        query: updateArtwork,
                        variables: {
                          id: transaction.artwork_id,
                          owner_id,
                        },
                      });
                    }
                  )
                  .catch(console.log);
            })
            .catch(console.log);
        })
      )
      .catch(console.log),
  2000
);
