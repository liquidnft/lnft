const { keypair, parse, sign } = require("./wallet");
const { hasura } = require("./api");

const wretch = require("wretch");
const fetch = require("node-fetch");
wretch().polyfills({ fetch });
const { HASURA_URL } = process.env;

const query = `
  query($assets: [String!]) {
    artworks(where: { asset: { _in: $assets }}) {
      id 
      asking_asset
      royalty
      auction_start
      auction_end
      list_price_tx
      artist {
        id
        address
        multisig
      } 
      owner {
        id
        address
        multisig
      } 
    } 
  }`;

const userQuery = `
  query {
    currentuser {
      address
      multisig
    } 
  }`;

app.get("/pubkey", async (req, res) => {
  const { pubkey } = keypair();
  res.send({ pubkey: pubkey.toString("hex") });
});

app.post("/sign", auth, async (req, res) => {
  const userapi = wretch().url(HASURA_URL).headers(req.headers);

  try {
    const { psbt } = req.body;
    const [txid, outputs] = parse(psbt);
    let variables = { assets: outputs.map((o) => o.asset) };

    let {
      data: { artworks },
    } = await hasura.post({ query, variables }).json();

    let {
      data: { currentuser },
    } = await userapi.post({ query: userQuery }).json();
    let user = currentuser[0];

    artworks.map(({ royalty, artist, owner, asking_asset, auction_start: start, auction_end: end }) => {
      if (end && isWithinInterval(new Date(), { start, end })) throw new Error("Auction underway");

          let outs = outputs.filter((o) => o.asset === asking_asset);
      let toArtist = outs
        .filter(
          (o) => o.address === artist.address || o.address === artist.multisig
        )
        .reduce((a, b) => (a += b.value), 0);

      let toOwner = outs
        .filter(
          (o) => o.address === owner.address || o.address === owner.multisig
        )
        .reduce((a, b) => (a += b.value), 0);

      if (toOwner && royalty) {
        let amountDue = Math.round((toOwner * royalty) / 100);
        if (toArtist < amountDue && artist.id !== owner.id)
          throw new Error("Royalty not paid");
      }
    });

    res.send({ base64: sign(psbt).toBase64() });
  } catch (e) {
    res.status(500).send(e.message);
  }
});
