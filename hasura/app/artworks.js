const { hasura } = require("./api");

const crypto = require("crypto");
const wretch = require("wretch");
const { HASURA_URL } = process.env;

app.post("/viewed", (req, res) => {
  const query = `mutation ($id: uuid!) {
    update_artworks_by_pk(pk_columns: { id: $id }, _inc: { views: 1 }) {
      id
    }
  }`;

  hasura.post({
    query,
    variables: { id: req.body.id },
  });

  res.send({});
});

app.post("/transaction", auth, async (req, res) => {
  const api = wretch().url(`${HASURA_URL}/v1/graphql`).headers(req.headers);
  const query = `mutation create_transaction($transaction: transactions_insert_input!) {
    insert_transactions_one(object: $transaction) {
      id,
      artwork_id
    } 
  }`;

  const { transaction } = req.body;

  let r = await api
    .post({ query, variables: { transaction } })
    .json()
    .catch(console.error);

  res.send(r);
});
