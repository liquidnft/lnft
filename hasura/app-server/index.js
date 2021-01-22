const wretch = require("wretch");
const fetch = require("node-fetch");
const httpProxy = require("http-proxy");
const auth = require("./auth");

httpProxy
  .createProxyServer({
    target: "https://blockstream.info/liquid/api",
    changeOrigin: true,
  })
  .listen(8092);

const { AMP_TOKEN, HASURA_SECRET, HASURA_URL } = process.env;
wretch().polyfills({ fetch });

const amp = wretch()
  .url("https://amp-beta.blockstream.com/api")
  .headers({ authorization: `token ${AMP_TOKEN}` });

const api = wretch()
  .url(HASURA_URL)
  .headers({ "x-hasura-admin-secret": HASURA_SECRET });

const gdk = wretch().url("http://gdk-server");

// Require the framework and instantiate it
const fastify = require("fastify")({
  logger: true,
});

fastify.post("/issue", async (req, res) => {
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

fastify.post("/user", async (req, res) => {
  const query = `mutation update_user($user: users_set_input!, $username: String!) {
    update_users(where: { username: { _eq: $username }}, _set: $user) {
      affected_rows
    }
  }`;

  let user = await gdk.get().json();
  let { username } = req.body;

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

  res.send(
    await api
      .post({
        query,
        variables: { username, user },
      })
      .json()
  );
});

fastify.listen(8091, "0.0.0.0", function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
