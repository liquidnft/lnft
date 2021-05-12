const { coinos } = require("./api");
const btc = "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225";
// const btc = "6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d";

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
