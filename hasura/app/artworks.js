const { hasura } = require("./api");

const crypto = require("crypto");
const wretch = require("wretch");
const { HASURA_URL, SERVER_URL } = process.env;

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
  const { transaction } = req.body;

  let query = `query {
    artworks(where: { id: { _eq: "${transaction.artwork_id}" }}) {
      owner {
        display_name
      } 
      title
      slug
      bid {
        user {
          id
          display_name
        } 
      } 
    }
  }`;

  let r = await hasura.post({ query }).json().catch(console.error);
  let { owner, title, bid, slug } = r.data.artworks[0];

  let locals = {
    outbid: false,
    title,
    url: `${SERVER_URL}/a/${slug}`,
  };

  try {
    await mail.send({
      template: "notify-bid",
      locals,
      message: {
        to: owner.display_name,
      },
    });

    if (bid.length && bid[0].user) {
      locals.outbid = true;

      await mail.send({
        template: "notify-bid",
        locals,
        message: {
          to: bid[0].user.display_name,
        },
      });
    }
  } catch (err) {
    console.error("Unable to send email");
    console.error(err);
  }

  query = `mutation create_transaction($transaction: transactions_insert_input!) {
    insert_transactions_one(object: $transaction) {
      id,
      artwork_id
    } 
  }`;

  r = await api
    .post({ query, variables: { transaction } })
    .json()
    .catch(console.error);

  res.send(r);
});
