const jwt = require("jsonwebtoken");
const { HASURA_JWT } = process.env;
const { cf, hasura, hbp } = require("./api");
const wretch = require("wretch");
const ipfsClient = require("ipfs-http-client");
const { globSource } = ipfsClient;
const faces = require("./faces");

auth = {
  preValidation(req, res, done) {
    let fail = () => res.code(401).send("Unauthorized");
    if (!req.headers.authorization) fail();
    let token = req.headers.authorization.split(" ")[1];
    if (!token) fail();
    let { key } = JSON.parse(HASURA_JWT);
    try {
      req.token = jwt.verify(token, key);
      done();
    } catch (e) {
      console.log(e.message);
      fail();
    }
  },
};

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let query = `query  users($email: String!) {
    users(where: {_or: [{display_name: {_eq: $email}}, {username: {_eq: $email }}]}, limit: 1) {
      display_name
    }
  }`;

  let users = await hasura.post({ query, variables: { email } }).json();
  email = users.data.users[0].display_name;

  try {
    let response = await hbp.url("/auth/login").post({ email, password }).res();
    Array.from(response.headers.entries()).forEach(([k, v]) =>
      res.header(k, v)
    );
    res.send(await response.json());
  } catch (e) {
    res.code(401).send("Login failed");
  }
});

app.post("/register", async (req, res) => {
  let {
    address,
    pubkey,
    mnemonic,
    multisig,
    email,
    password,
    username,
  } = req.body;

  try {
    let response = await hbp
      .url("/auth/register")
      .post({ email, password })
      .res();

    function rand(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    response = await wretch()
      .url(
        `https://unavatar.now.sh/${email}?fallback=${faces[rand(0, 300)]}`
      )
      .get()
      .res();

    const ipfs = ipfsClient(process.env.IPFS_URL);
    let { cid } = await ipfs.add(response.body);

    let query = `mutation ($user: users_set_input!, $email: String!) {
      update_users(where: {display_name: {_eq: $email}}, _set: $user) {
        affected_rows 
      }
    }`;

    response = await hasura
      .post({
        query,
        variables: {
          email,
          user: {
            full_name: username,
            username,
            address,
            pubkey,
            mnemonic,
            multisig,
            avatar_url: cid.toString(),
          },
        },
      })
      .json()
      .catch(console.log);

    if (response.errors) {
      let deleteQuery = `mutation { 
        delete_users(where: { account: { email: { _eq: "${email}" } } }) 
        { 
          affected_rows 
        } 
      }`;

      await hasura.post({ query: deleteQuery }).json();
      if (response.errors.find((e) => e.message.includes("Unique")))
        throw new Error("Username taken");
      throw new Error("There was an error during registration");
    }

    res.send("Registered!");
  } catch (e) {
    console.log(e);
    res.code(500).send(e.message);
  }
});

app.post("/approve", auth, async (req, res) => {
  cf.post({
    type: "A",
    name: `${req.body.username}.${process.env.DOMAIN}`,
    content: "207.81.214.2",
    ttl: 120,
    priority: 10,
    proxied: true,
  });
});
