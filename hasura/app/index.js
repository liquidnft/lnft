const { cf, hasura, hbp } = require("./api");
const wretch = require("wretch");

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
  let data = await wretch()
    .url(`https://unavatar.now.sh/${req.body.display_name}`)
    .get()
    .blob();
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
