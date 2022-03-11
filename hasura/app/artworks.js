const { v4 } = require("uuid");
const { api, q, lnft } = require("./api");
const { broadcast, btc, parseAsset } = require("./wallet");
const { Psbt } = require("liquidjs-lib");
const { compareAsc, parseISO } = require("date-fns");
const {
  acceptBid,
  cancelBid,
  createArtwork,
  createTransaction,
  getCurrentUser,
  getTransactionArtwork,
  getTransactionUser,
  setHeld,
  setOwner,
  setPsbt,
  setRelease,
  updateViews,
} = require("./queries");
const { SERVER_URL } = process.env;
const { kebab, sleep, wait } = require("./utils");

const crypto = require("crypto");

const getUser = async ({ headers }) => {
  let { data, errors } = await api(headers)
    .post({ query: getCurrentUser })
    .json();

  if (errors) throw new Error(errors[0].message);
  return data.currentuser[0];
};

app.post("/cancel", auth, async (req, res) => {
  try {
    let { id } = req.body;
    let { transactions_by_pk: tx } = await q(getTransactionUser, { id });
    let user = await getUser(req);

    if (tx.user_id !== user.id) return res.code(401).send();

    res.send(await q(cancelBid, { id }));
  } catch (e) {
    console.log("problem cancelling bid", e);
    res.code(500).send(e.message);
  }
});

app.post("/transfer", auth, async (req, res) => {
  try {
    let { address, transaction } = req.body;

    let utxos = await lnft.url(`/address/${address}/utxo`).get().json();
    let attempts = 0;
    let received = () => utxos.find((tx) => tx.asset === transaction.asset);

    console.log("transferring", transaction);

    while (!received() && attempts < 5) {
      await new Promise((r) => setTimeout(r, 2000));
      utxos = await lnft.url(`/address/${address}/utxo`).get().json();
      attempts++;
    }

    if (received()) {
      transaction.user_id = req.body.id;
      transaction.type = "receipt";

      await q(createTransaction, { transaction });
    }

    res.send({});
  } catch (e) {
    console.log("problem transferring artwork", e);
    res.code(500).send(e.message);
  }
});

app.post("/viewed", async (req, res) => {
  try {
    let { update_artworks_by_pk } = await q(updateViews, { id: req.body.id });
    let { asset, owner } = update_artworks_by_pk;
    let { address, multisig } = owner;

    let find = async (a) =>
      (await lnft.url(`/address/${a}/utxo`).get().json()).find(
        (tx) => tx.asset === asset
      );

    let held = null;
    if (await find(address)) held = "single";
    if (await find(multisig)) held = "multisig";

    await q(setHeld, { id: req.body.id, held });

    res.send({});
  } catch (e) {
    console.log(e);
    res.code(500).send(e.message);
  }
});

app.post("/claim", auth, async (req, res) => {
  try {
    let {
      artwork: { asset, id },
    } = req.body;

    let user = await getUser(req);
    let { address, multisig } = user;

    let utxos = [
      ...(await lnft.url(`/address/${address}/utxo`).get().json()),
      ...(await lnft.url(`/address/${multisig}/utxo`).get().json()),
    ];

    res.send(await q(setOwner, { id, owner_id: user.id }));
  } catch (e) {
    console.log(e);
    res.code(500).send(e.message);
  }
});

app.post("/transaction", auth, async (req, res) => {
  try {
    const { transaction } = req.body;

    let { artworks } = await q(getTransactionArtwork, {
      id: transaction.artwork_id,
    });
    let {
      id: artwork_id,
      bid_increment,
      auction_end,
      auction_start,
      owner,
      title,
      bid,
      slug,
    } = artworks[0];

    if (
      bid &&
      transaction.type === "bid" &&
      transaction.amount < bid.amount + bid_increment &&
      auction_end &&
      compareAsc(parseISO(auction_end), new Date()) > 0
    ) {
      throw new Error(
        `Minimum bid is ${((bid.amount + bid_increment) / 100000000).toFixed(
          8
        )}`
      );
    }

    if (transaction.type === "purchase") {
      let { id: owner_id } = await getUser(req);
      await q(setOwner, { id: artwork_id, owner_id });
    }

    let locals = {
      outbid: false,
      title,
      url: `${SERVER_URL}/a/${slug}`,
    };

    try {
      await mail.send({
        template: "notify-bid",
        locals,
        message: {
          to: owner.display_name,
        },
      });

      if (bid && bid.user) {
        locals.outbid = true;

        await mail.send({
          template: "notify-bid",
          locals,
          message: {
            to: bid.user.display_name,
          },
        });
      }
    } catch (err) {
      console.error("Unable to send email");
      console.error(err);
    }

    ({ data, errors } = await api(req.headers)
      .post({ query: createTransaction, variables: { transaction } })
      .json());

    if (errors) throw new Error(errors[0].message);

    res.send(data.insert_transactions_one);
  } catch (e) {
    console.log("problem creating transaction", e);
    res.code(500).send(e.message);
  }
});

app.post("/release/update", auth, async (req, res) => {
  try {
    res.send(await q(setRelease, req.body));
  } catch (e) {
    console.log("problem releasing from auction", e);
    res.code(500).send(e.message);
  }
});

app.post("/tx/update", auth, async (req, res) => {
  try {
    res.send(await q(setPsbt, req.body));
  } catch (e) {
    console.log("problem updating transaction", e);
    res.code(500).send(e.message);
  }
});

app.post("/accept", auth, async (req, res) => {
  try {
    await broadcast(Psbt.fromBase64(req.body.psbt));
    let { data } = await api(req.headers)
      .post({ query: acceptBid, variables: req.body })
      .json();
    res.send(data);
  } catch (e) {
    console.log(e);
    res.code(500).send(e.message);
  }
});

const issuances = {};
const issue = async (
  issuance,
  ids,
  { body: { artwork, transactions }, headers }
) => {
  issuances[issuance] = { length: transactions.length, i: 0 };
  let tries = 0;
  let i = 0;

  while (i < transactions.length && tries < 40) {
    let slug;
    try {
      artwork.id = ids[i];
      artwork.edition = i + 1;
      artwork.slug = kebab(artwork.title || "untitled");

      if (i > 0) artwork.slug += "-" + i + 1;

      artwork.slug += "-" + artwork.id.substr(0, 5);
      if (i === 0) slug = artwork.slug;

      let { contract, psbt } = transactions[i];
      let p = Psbt.fromBase64(psbt);
      await broadcast(p);
      let tx = p.extractTransaction();
      let hash = tx.getId();
      contract = JSON.stringify(contract);
      artwork.asset = parseAsset(
        tx.outs.find((o) => parseAsset(o.asset) !== btc).asset
      );

      let tags = artwork.tags.map(({ tag }) => ({
        tag,
        artwork_id: artwork.id,
      }));

      let {
        id,
        asset,
        title,
        description,
        edition,
        editions,
        filename,
        filetype,
        is_physical,
      } = artwork;

      let variables = {
        artwork: {
          id,
          title,
          description,
          asset,
          slug,
          edition,
          editions,
          filename,
          filetype,
          is_physical,
        },
        transaction: {
          artwork_id: id,
          type: "creation",
          hash,
          contract,
          asset,
          amount: 1,
          psbt: p.toBase64(),
        },
        tags,
      };

      ({ data, errors } = await api(headers)
        .post({ query: createArtwork, variables })
        .json());

      if (errors) {
        console.log(variables);
        throw new Error(errors[0].message);
      }

      tries = 0;
      issuances[issuance].i = ++i;
      issuances[issuance].asset = artwork.asset;
    } catch (e) {
      console.log("failed issuance", e);
      await sleep(5000);
      tries++;
    }
  }

  try {
    // await api
    //   .url("/mail-artwork-minted")
    //   .auth(`Bearer ${$session.jwt}`)
    //   .post({
    //     userId: $session.user.id,
    //     artworkId: artwork.id,
    //   });
  } catch (e) {
    console.log(e);
  }
};

app.post("/issue", auth, async (req, res) => {
  try {
    let { artwork, transactions } = req.body;
    let issuance = v4();
    let ids = transactions.map((t) => v4());
    issue(issuance, ids, req);
    let slug = kebab(artwork.title || "untitled") + "-" + ids[0].substr(0, 5);
    let { address } = await getUser(req);

    await wait(async () => {
      try {
        if (!issuances[issuance]) return;
        let utxos = await lnft.url(`/address/${address}/utxo`).get().json();
        return utxos.find((tx) => tx.asset === issuances[issuance].asset);
      } catch (e) {
        console.log("failed to get utxos", e);
      }
    });

    res.send({ id: ids[0], asset: issuances[issuance].asset, issuance, slug });
  } catch (e) {
    console.log(e);
    res.code(500).send(e.message);
  }
});

app.get("/issuance", auth, async (req, res) => {
  try {
    res.send(issuance[req.body.issuance]);
  } catch (e) {
    console.log(e);
    res.code(500).send(e.message);
  }
});
