const { hasura } = require("./api");

const crypto = require("crypto");
const wretch = require("wretch");

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
