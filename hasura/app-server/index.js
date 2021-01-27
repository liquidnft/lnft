const { generateMnemonic } = require("bip39");
const auth = require("./auth");
const { amp, gdk, api } = require("./api");
require("./proxy");

const app = require("fastify")({
  logger: true,
});

app.get("/pubkey", async (req, res) => {
  const { pubkey } = require("./wallet").keypair(generateMnemonic());
  res.send({ pubkey });
});

app.post("/multisig", async (req, res) => {
  const { pubkey } = req.body;
  const { multisig } = require("./wallet");
  res.send(multisig(pubkey));
});

app.post("/multipay", async (req, res) => {
  const { address, fee, pubkey } = req.body;
  const { multipay } = require("./wallet");
  const swap = await multipay(pubkey, 1000, fee, address);
  res.send({ swap });
});

app.listen(8091, "0.0.0.0", function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`server listening on ${address}`);
});
