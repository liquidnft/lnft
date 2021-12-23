const { coinos } = require("./api");
const { networks } = require("liquidjs-lib");

let network;
if (process.env.LIQUID_ELECTRS_URL.includes("blockstream")) {
  network = networks.liquid;
} else {
  network = networks.regtest;
}

const btc = network.assetHash;
const fee = 100;

app.post("/bitcoin", auth, async (req, res) => {
  let network = "bitcoin";
  let { liquidAddress, amount } = req.body;

  let { address } = await coinos
    .url("/address")
    .query({ network, type: "bech32" })
    .get()
    .json();

  amount += fee;

  await coinos
    .url("/invoice")
    .post({
      liquidAddress,
      invoice: {
        address,
        network,
        text: address,
        amount,
      },
    })
    .json();

  return { address, fee };
});

app.post("/liquid", auth, async (req, res) => {
  let network = "liquid";
  let { liquidAddress, amount } = req.body;

  let { address, confidentialAddress } = await coinos
    .url("/address")
    .query({ network, type: "bech32" })
    .get()
    .json();

  amount += fee;

  await coinos
    .url("/invoice")
    .post({
      liquidAddress,
      invoice: {
        unconfidential: address,
        address: confidentialAddress,
        network,
        text: address,
        amount,
      },
    })
    .json();

  return { address: confidentialAddress, fee };
});

app.post("/lightning", auth, async (req, res) => {
  let { liquidAddress, amount } = req.body;

  let text = await coinos.url("/lightning/invoice").post({ amount: 0 }).text();

  await coinos
    .url("/invoice")
    .post({
      liquidAddress,
      invoice: {
        network: "lightning",
        text,
        amount: 0,
      },
    })
    .json();

  res.send({ address: text, fee });
});
