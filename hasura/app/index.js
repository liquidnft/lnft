const { cf } = require("./api");
const wretch = require("wretch");

auth = require("./auth");

app = require("fastify")({
  logger: true,
});

require("./proxy");
require("./monitor");
require("./signing");
require("./upload");

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
