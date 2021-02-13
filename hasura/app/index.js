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

app.post("/register", async (req, res) => {
  let result = await wretch().url("http://hbp:3000/auth/register").post(req.body).res();
  cf.post({
    type: "A",
    name: `${req.body.user_data.username}.${process.env.DOMAIN}`,
    content: "207.81.214.2",
    ttl: 120,
    priority: 10,
    proxied: true,
  });
  res.send(result);
});

app.listen(8091, "0.0.0.0", function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`server listening on ${address}`);
});
