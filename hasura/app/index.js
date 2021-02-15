const toBuffer = require("blob-to-buffer");
const fs = require("fs");
const { cf, hasura, hbp } = require("./api");
const wretch = require("wretch");
const ipfsClient = require("ipfs-http-client");
const { globSource } = ipfsClient;

auth = require("./auth");

app = require("fastify")({
  logger: true,
});

require("./proxy");
require("./monitor");
require("./signing");
require("./upload");

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let query = `query  users($email: String!) {
    users(where: {_or: [{display_name: {_eq: $email}}, {username: {_eq: $email }}]}, limit: 1) {
      display_name
    }
  }`;

  email = (await hasura.post({ query, variables: { email } }).json()).data
    .users[0].display_name;

  try {
    let response = await hbp.url("/auth/login").post({ email, password }).res();
    for (let [k, v] of Object.entries(response.headers)) {
      res.header(k, v);
    }
    res.send(await response.json());
  } catch (e) {
    res.code(401).send("Login failed");
  }
});

app.post("/register", async (req, res) => {
  let { email, password, username } = req.body;
  try {
    let response = await hbp
      .url("/auth/register")
      .post({ email, password })
      .res();

    response = await wretch()
      .url(
        `https://unavatar.now.sh/${email}?fallback=https://icotar.com/avatar/${email}`
      )
      .get()
      .res();

    const ipfs = ipfsClient("http://ipfs:5001");
    let { cid } = await ipfs.add(response.body);
    let avatar = cid.toString();

    let query = `mutation ($email: String!, $avatar: String!, $username: String!) {
    update_users(where: {display_name: {_eq: $email}}, _set: { full_name: $username, username: $username, avatar_url: $avatar }) {
      affected_rows 
    }
  }`;

    await hasura.post({ query, variables: { email, username, avatar } }).json();

    res.send("Registered!");
  } catch (e) {
    console.log(e);
    res.code(500).send(e.message);
  }
});

app.post("/approve", auth, async (req, res) => {
  console.log(req.token);
  cf.post({
    type: "A",
    name: `${req.body.username}.${process.env.DOMAIN}`,
    content: "207.81.214.2",
    ttl: 120,
    priority: 10,
    proxied: true,
  });
});

app.listen(8091, "0.0.0.0", function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`server listening on ${address}`);
});
