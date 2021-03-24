const { hasura } = require("./api");
const IORedis = require("ioredis");
const crypto = require("crypto");
const wretch = require("wretch");

const { REDIS_URL: url, HASURA_URL } = process.env;

const redis = new IORedis({ url });
const abcache = require("abstract-cache")({
  useAwait: false,
  driver: {
    name: "abstract-cache-redis", // must be installed via `npm install`
    options: { client: redis },
  },
});

app
  .register(require("fastify-redis"), { client: redis })
  .register(require("fastify-caching"), { cache: abcache });

app.get("/artworks", async (req, reply) => {
  const query = `query {
    artworks {
      title
      asset
    }
  }`;

  let {
    data: { artworks },
  } = await hasura.post({ query }).json();

  app.cache.set("artworks", artworks, 10000, (err) => {
    if (err) return reply.send(err);
    let etag = crypto
      .createHash("sha1")
      .update(JSON.stringify(artworks))
      .digest("hex")
      .substring(0, 27);
    reply.etag(etag);
    reply.send(artworks);
  });
});

app.get("/users", async (req, reply) => {
  const query = `query {
    users {
      id
      address
      multisig
      username
      avatar_url
    }
  }`;

  let {
    data: { users },
  } = await hasura.post({ query }).json();

  reply.send(await new Promise((resolve) => app.cache.set("users", users, 10000, (err) => {
    if (err) return reply.send(err);
    let etag = crypto
      .createHash("sha1")
      .update(JSON.stringify(users))
      .digest("hex")
      .substring(0, 27);
    reply.etag(etag);
    resolve(users);
  })));
});

app.get("/user", auth, async (req, reply) => {
  const userapi = wretch().url(`${HASURA_URL}/v1/graphql`).headers(req.headers);
  let fields =
    "id, username, location, bio, email, full_name, website, twitter, instagram, avatar_url, address, multisig, pubkey";

  let privateFields = "is_artist, mnemonic, wallet_initialized, is_admin, info";

  let computed = "followed, num_follows, num_followers";

  const query = `query {
    currentuser (limit: 1) { 
      ${fields} 
      ${privateFields}
    }
  }`;

  let {
    data: { currentuser },
  } = await userapi.post({ query }).json();
  user = await new Promise((resolve) => app.cache.set(user.id, user, 10000, (err) => {
    if (err) return reply.send(err);
    let etag = crypto
      .createHash("sha1")
      .update(JSON.stringify(user))
      .digest("hex")
      .substring(0, 27);

    reply.etag(etag);
    resolve(user);
  }));

  reply.send(user);
});

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
