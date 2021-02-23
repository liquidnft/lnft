const { hasura } = require("./api");

const query = `mutation ($id: uuid!) {
  update_artworks_by_pk(pk_columns: { id: $id }, _inc: { views: 1 }) {
    id
  }
}`;

app.post("/viewed", (req, res) => {
  hasura.post({
    query,
    variables: { id: req.body.id },
  });

  res.send({});
});
