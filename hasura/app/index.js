const toBuffer = require("blob-to-buffer");
const fs = require("fs");
const { cf, coinos, hasura, hbp } = require("./api");
const wretch = require("wretch");
const ipfsClient = require("ipfs-http-client");
const { globSource } = ipfsClient;
const btc = "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225";

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

    response = await wretch()
      .url(
        `https://unavatar.now.sh/${email}?fallback=https://icotar.com/avatar/${email}`
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

app.post("/bitcoin", auth, async (req, res) => {
  let network = "bitcoin";
  let { liquidAddress, amount } = req.body;
  let { address } = await coinos
    .url("/address")
    .query({ network, type: "bech32" })
    .get()
    .json();

  let { tx } = await coinos
    .url("/liquid/fee")
    .post({ address: liquidAddress, asset: btc, amount, feeRate: 1000 })
    .json();

  let fee = Math.round(100000000 * tx.fee);
  amount += fee;

  await coinos
    .url("/invoice")
    .post({
      liquidAddress,
      tx,
      invoice: {
        address,
        network,
        text: address,
        amount,
      },
    })
    .json();

  res.send({ address, fee });
});

app.post("/lightning", auth, async (req, res) => {
  let { liquidAddress, amount } = req.body;

  let { tx } = await coinos
    .url("/liquid/fee")
    .post({ address: liquidAddress, asset: btc, amount, feeRate: 1000 })
    .json()
    .catch(console.log);

  let fee = Math.round(100000000 * tx.fee);
  amount += fee;

  let text = await coinos.url("/lightning/invoice").post({ amount }).text();

    await coinos
      .url("/invoice")
      .post({
        liquidAddress,
        tx,
        invoice: {
          network: "lightning",
          text,
          amount,
        },
      })
      .json()

  res.send({ address: text, fee });
});

app.listen(8091, "0.0.0.0", function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`server listening on ${address}`);
});
