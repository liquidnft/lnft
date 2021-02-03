const auth = require("./auth");
const proxy = require("fastify-http-proxy");

app = require("fastify")({
  logger: true,
});

require("./proxy");
require("./monitor");
require("./signing");

app.listen(8091, "0.0.0.0", function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`server listening on ${address}`);
});
