const { generateMnemonic } = require("bip39");
const auth = require("./auth");
const { amp, gdk, api } = require("./api");
const { keypair, sign } = require("./wallet");
require("./proxy");
require("./monitor");

const app = require("fastify")({
  logger: true,
});

app.get("/pubkey", async (req, res) => {
  const { pubkey } = keypair();
  res.send({ pubkey: pubkey.toString("hex") });
});

app.post("/sign", async (req, res) => {
  const { psbt } = req.body;
  res.send({ base64: sign(psbt).toBase64() });
});

app.listen(8091, "0.0.0.0", function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`server listening on ${address}`);
});
