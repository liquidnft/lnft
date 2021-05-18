const { coinos } = require("./api");
const { networks } = require("@asoltys/liquidjs-lib");

let network;
if (process.env.LIQUID_ELECTRS_URL.includes("blockstream")) {
  network = networks.liquid;
} else {
  network = networks.regtest;
}

const btc = network.assetHash;

app.post("/bitcoin", auth, async (req, res) => {
  let network = "bitcoin";
  let { liquidAddress, amount } = req.body;

  let { address } = await coinos
    .url("/address")
    .query({ network, type: "bech32" })
    .get()
    .json();

  let { tx } = await coinos
    .url("/liquid/fee")
    .post({ address: liquidAddress, asset: btc, amount, feeRate: 100 })
    .json();

  let fee = Math.round(100000000 * tx.fee);
  amount += fee;

  await coinos
    .url("/invoice")
    .post({
      liquidAddress,
      tx,
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

  let { tx } = await coinos
    .url("/liquid/fee")
    .post({ address: liquidAddress, asset: btc, amount, feeRate: 100 })
    .json();

  let fee = Math.round(100000000 * tx.fee);
  amount += fee;

  await coinos
    .url("/invoice")
    .post({
      liquidAddress,
      tx,
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

  let { tx } = await coinos
    .url("/liquid/fee")
    .post({ address: liquidAddress, asset: btc, amount, feeRate: 1000 })
    .json()
    .catch(console.log);

  let fee = Math.round(100000000 * tx.fee);
  amount += fee;

  let text = await coinos.url("/lightning/invoice").post({ amount }).text();

  await coinos
    .url("/invoice")
    .post({
      liquidAddress,
      tx,
      invoice: {
        network: "lightning",
        text,
        amount,
      },
    })
    .json();

  res.send({ address: text, fee });
});
