const toBuffer = require("blob-to-buffer");
const { formatISO } = require("date-fns");
const fs = require("fs");
const path = require("path");

require("make-promises-safe");

app = require("fastify")();

app.register(require("fastify-static"), {
  root: path.join("/export"),
  prefix: "/public/", // optional: default '/'
});


require("./auth");
require("./artworks");
require("./auctions");
require("./coinos");
require("./proxy");
require("./monitor");
require("./signing");
require("./upload");
require("./mail");

app.listen(8091, "0.0.0.0", function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`server listening on ${address}`);
});
