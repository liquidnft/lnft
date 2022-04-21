import { keypair, parse, sign } from "./wallet.js";
import { hasura } from "./api.js";
import { parseISO, isWithinInterval } from "date-fns";
import { address as Address } from "liquidjs-lib";
import wretch from "wretch";
import fetch from "node-fetch";
wretch().polyfills({ fetch });
const { HASURA_URL } = process.env;
import { app } from "./app.js";
import { auth } from "./auth.js";

const query = `
  query($assets: [String!]) {
    artworks(where: { asset: { _in: $assets }}) {
      id 
      asset
      asking_asset
      has_royalty
      royalty_recipients {
        id
        asking_asset
        amount
        address
        name
      }
      auction_start
      auction_end
      list_price
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
  try {
    const { psbt } = req.body;

    await check(psbt);

    res.send({ base64: sign(psbt).toBase64() });
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
});

export const check = async (psbt) => {
  const [txid, inputs, outputs] = await parse(psbt);

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
      has_royalty,
      royalty_recipients,
      artist,
      owner,
      list_price,
      asking_asset,
      auction_start,
      auction_end,
    }) => {
      let outs = outputs.filter((o) => o.asset === asking_asset);

      let toRoyaltyRecipients = outs
        .filter((o) => {
          const recipientsWithOuts = royalty_recipients.find((recipient) => {
            let unconfidential;
            try {
              unconfidential = Address.fromConfidential(
                recipient.address
              ).unconfidentialAddress;
            } catch (e) {}

            return (
              recipient.address === o.address || unconfidential === o.address
            );
          });
          return !!recipientsWithOuts;
        })
        .reduce((a, b) => (a += b.value), 0);

      let toOwner =
        outs
          .filter(
            (o) => o.address === owner.address || o.address === owner.multisig
          )
          .reduce((a, b) => a + parseInt(b.value), 0) -
        inputs
          .filter(
            (o) =>
              o.asset === asking_asset &&
              (o.address === owner.address || o.address === owner.multisig)
          )
          .reduce((a, b) => a + parseInt(b.value), 0);

      if (auction_end) {
        let start = parseISO(auction_start);
        let end = parseISO(auction_end);

        if (
          toOwner !== list_price &&
          isWithinInterval(new Date(), { start, end })
        )
          throw new Error("Auction underway");
      }

      if (has_royalty) {
        if (toOwner) {
          let amountDue = 0;

          for (let i = 0; i < royalty_recipients.length; i++) {
            const element = royalty_recipients[i];

            amountDue += Math.round((toOwner * element.amount) / 100);
          }

          if (toRoyaltyRecipients < amountDue && artist.id !== owner.id)
            throw new Error("Royalty not paid");
        }

        if (
          outputs.find(
            (o) => o.asset === asset && !multisig.includes(o.address)
          )
        ) {
          throw new Error(
            "Token cannot be transferred to an external address when royalties are activated or auction is underway."
          );
        }
      }
    }
  );
};
