const { keypair, parse, sign } = require("./wallet");
const { hasura } = require("./api");
const { parseISO, isWithinInterval } = require("date-fns");

const wretch = require("wretch");
const fetch = require("node-fetch");
wretch().polyfills({ fetch });
const { HASURA_URL } = process.env;

const query = `
  query($assets: [String!]) {
    artworks(where: { asset: { _in: $assets }}) {
      id 
      asset
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

const allMultisig = `query {
  users {
    multisig
  } 
}`;

app.get("/pubkey", async (req, res) => {
  const { pubkey } = keypair();
  res.send({ pubkey: pubkey.toString("hex") });
});

app.post("/sign", auth, async (req, res) => {
  const userapi = wretch().url(`${HASURA_URL}/v1/graphql`).headers(req.headers);

  try {
    const { psbt } = req.body;

    await check(psbt);

    res.send({ base64: sign(psbt).toBase64() });
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
});

const check = async (psbt) => {
  const [txid, outputs] = parse(psbt);

  const multisig = (
    await hasura.post({ query: allMultisig }).json().catch(console.log)
  ).data.users.map((u) => u.multisig);

  let variables = { assets: outputs.map((o) => o.asset) };

  let {
    data: { artworks },
  } = await hasura.post({ query, variables }).json();

  artworks.map(
    ({
      asset,
      royalty,
      artist,
      owner,
      asking_asset,
      auction_start,
      auction_end,
    }) => {
      if (auction_end) {
        let start = parseISO(auction_start);
        let end = parseISO(auction_end);

        if (isWithinInterval(new Date(), { start, end }))
          throw new Error("Auction underway");
      }

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

      if (royalty) {
        if (toOwner) {
          let amountDue = Math.round((toOwner * royalty) / 100);
          if (toArtist < amountDue && artist.id !== owner.id)
            throw new Error("Royalty not paid");
        }

        if (
          outputs.find(
            (o) => o.asset === asset && !multisig.includes(o.address)
          )
        ) {
          throw new Error("Unrecognized recipient address");
        }
      }
    }
  );
};

module.exports = { check };
