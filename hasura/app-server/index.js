const wretch = require("wretch");
const fetch = require("node-fetch");

const { AMP_TOKEN: token } = process.env;
wretch().polyfills({ fetch });
const amp = wretch()
  .url("https://amp-beta.blockstream.com/api")
  .headers({ authorization: `token ${token}` });

// Require the framework and instantiate it
const fastify = require("fastify")({
  logger: true,
});

// Declare a route
fastify.get("/", async (req, res) => {
  res.send(
    await amp
      .url("/assets/issue")
      .post({
        name: "An example asset with registration data",
        amount: 1,
        is_confidential: false,
        destination_address:
          "VJLDx6D5vo4VqQDY2kSJu8A9LinUVu6gW2DX5P8BDx46P8DXhCeNhz2pg35W3fsVuLjwbabfJbXmS6en",
        domain: "coinos.com",
        ticker: "AMPZE",
        precision: 0,
        pubkey:
          "038babfbe4d62b796b51c3e7158bebdcc3770e93689d8298dd0f18729ef28ccdf3",
        is_reissuable: false,
      })
      .json()
  );
});

fastify.post("/user", function (request, reply) {
  fastify.log.info(request.body);
  reply.send(true);
});

fastify.post("/asset", function (request, reply) {
  fastify.log.info(request.body);
  wretch;
  reply.send(true);
});

// Run the server!
fastify.listen(3090, "0.0.0.0", function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
