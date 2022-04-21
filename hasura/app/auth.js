import { app } from "./app.js";
import jwt from "jsonwebtoken";
const { HASURA_JWT } = process.env;
import { q, cf, hasura, hbp } from "./api.js";
import wretch from "wretch";
import {
  deleteUserByEmail,
  getUserByEmail,
  updateUserByEmail,
} from "./queries.js";

export let auth = {
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
  try {
    let user;
    let { users } = await q(getUserByEmail, { email });

    if (users.length) {
      user = users[0];
      email = user.display_name;
    } else {
      throw new Error();
    }

    let response = await hbp.url("/auth/login").post({ email, password }).res();
    Array.from(response.headers.entries()).forEach(([k, v]) =>
      res.header(k, v)
    );
    res.send(await response.json());
  } catch (e) {
    let msg = "Login failed";
    if (e.message.includes("activated"))
      msg = "Account not activated, check email for a confirmation link";
    res.code(401).send(msg);
  }
});

app.post("/register", async (req, res) => {
  let { address, pubkey, mnemonic, multisig, email, password, username } =
    req.body;

  try {
    let response = await hbp
      .url("/auth/register")
      .post({ email, password })
      .res();

    try {
      await q(updateUserByEmail, {
        email,
        user: {
          full_name: username,
          username,
          address,
          pubkey,
          mnemonic,
          multisig,
        },
      });
    } catch (e) {
      await q(deleteUserByEmail, { email });
      if (e.message.includes("Unique")) throw new Error("Username taken");

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

app.get("/activate", async (req, res) => {
  const { ticket } = req.query;
  res.send(await hbp.url("/auth/activate").query({ ticket }).get().res());
});

app.post("/change-password", async (req, res) => {
  const { new_password, ticket } = req.body;
  res.send(
    await hbp
      .url("/auth/change-password/change")
      .post({ new_password, ticket })
      .res()
  );
});
