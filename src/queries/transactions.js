export const createTransaction = {
  query: `mutation create_transaction($transaction: transactions_insert_input!) {
    insert_transactions_one(object: $transaction) {
      id,
      artwork_id
    } 
  }`,
};

export const getOffers = `subscription {
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
}`;

export const acceptOffer = () => ({
  query: `mutation update_artwork($id: Int!, $owner_id: Int!) {
    update_artworks_by_pk(
      pk_columns: { id: $id }, 
      _set: { 
        owner_id: $owner_id,
        list_price: 0
      }
    ) {
      id
    }
  }`,
});
