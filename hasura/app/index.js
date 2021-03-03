const toBuffer = require("blob-to-buffer");
const { formatISO } = require("date-fns");
const fs = require("fs");
require('make-promises-safe');

app = require("fastify")({
  logger: true,
});

require("./auth");
require("./artworks");
require("./auctions");
require("./coinos");
require("./proxy");
require("./monitor");
require("./signing");
require("./upload");

app.listen(8091, "0.0.0.0", function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`server listening on ${address}`);
});
