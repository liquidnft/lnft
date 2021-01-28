const { keypair, sign } = require("./wallet");
const { api } = require("./api");

app.get("/pubkey", async (req, res) => {
  const { pubkey } = keypair();
  res.send({ pubkey: pubkey.toString("hex") });
});

app.post("/sign", async (req, res) => {
  const { psbt } = req.body;
  try {
    res.send({ base64: sign(psbt).toBase64() });
  } catch(e) {
    res.status(500).send(e.message);
  } 
});
