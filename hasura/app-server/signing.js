const { keypair, parse, sign } = require("./wallet");
const { hasura } = require("./api");

const query = `
  query($assets: [String!]) {
    artworks(where: { asset: { _in: $assets }}) {
      id 
      asking_asset
      royalty
      auction_start
      auction_end
      artist {
        address
      } 
    } 
  }`;

app.get("/pubkey", async (req, res) => {
  const { pubkey } = keypair();
  res.send({ pubkey: pubkey.toString("hex") });
});

app.post("/sign", async (req, res) => {
  const { psbt } = req.body;
  const outputs = parse(psbt);
  let variables = { assets: outputs.map((o) => o.asset) };

  let {
    data: { artworks },
  } = await hasura.post({ query, variables }).json();

  artworks.map((artwork) => {
    let outs = outputs.filter((o) => o.asset === artwork.asking_asset);
    let {
      royalty,
      artist: { address },
    } = artwork;

    let totalExternal = outs
      .filter((o) => o.address !== address)
      .reduce((a, b) => (a += b.value), 0);

    let totalToArtist = outs
      .filter((o) => o.address === address)
      .reduce((a, b) => (a += b.value), 0);

    if (totalExternal && royalty) {
      let amountDue = Math.round((totalExternal * royalty) / 100);
      if (totalToArtist < amountDue) throw new Error("Royalty not paid");
    }
  });

  throw new Error("no!");
  try {
    res.send({ base64: sign(psbt).toBase64() });
  } catch (e) {
    res.status(500).send(e.message);
  }
});
