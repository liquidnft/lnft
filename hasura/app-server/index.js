const auth = require("./auth");
const { amp, gdk, api } = require("./api");
require("./proxy");

const app = require("fastify")({
  logger: true,
});

app.post("/issue", auth, async (req, res) => {
  let {
    title: name,
    ticker,
    editions: amount,
    address: destination_address,
  } = req.body;

  res.send(
    await amp
      .url("/assets/issue")
      .post({
        name,
        amount,
        is_confidential: false,
        destination_address,
        domain: "coinos.com",
        ticker,
        precision: 0,
        pubkey:
          "038babfbe4d62b796b51c3e7158bebdcc3770e93689d8298dd0f18729ef28ccdf3",
        is_reissuable: false,
      })
      .json()
  );
});

app.post("/user", auth, async (req, res) => {
  const query = `mutation update_user($user: users_set_input!, $username: String!) {
    update_users(where: { username: { _eq: $username }}, _set: $user) {
      affected_rows
    }
  }`;

  let user = await gdk.get().json();
  let { username } = req.body;

  /*
  user.amp_user_id = (
    await amp
      .url("/registered_users/add")
      .post({
        is_company: false,
        name: username,
        GAID: user.gaid,
      })
      .json()
  ).id;
  */

  res.send(
    await api
      .post({
        query,
        variables: { username, user },
      })
      .json()
  );
});

app.listen(8091, "0.0.0.0", function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`server listening on ${address}`);
});
