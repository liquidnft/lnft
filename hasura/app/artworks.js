import { v4 } from "uuid";
import { api, q, lnft } from "./api.js";
import { broadcast, btc, parseAsset } from "./wallet.js";
import { Psbt } from "liquidjs-lib";
import { compareAsc, parseISO } from "date-fns";
import { mail } from "./mail.js";
import { auth } from "./auth.js";

import {
  acceptBid,
  cancelBid,
  createArtwork,
  createComment,
  createTransaction,
  deleteTransaction,
  getArtwork,
  getCurrentUser,
  getUserByAddress,
  getTransactionArtwork,
  getTransactionUser,
  updateArtwork,
  setHeld,
  setOwner,
  setPsbt,
  setRelease,
  updateViews,
} from "./queries.js";

const { SERVER_URL } = process.env;
import { kebab, sleep, wait } from "./utils.js";
import crypto from "crypto";
import { app } from "./app.js";

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
  let receipt_id, transfer_id;
  try {
    let sender = await getUser(req);
    let { address, artwork, psbt } = req.body;

    let transaction = {
      amount: 1,
      artwork_id: artwork.id,
      asset: artwork.asset,
      hash: Psbt.fromBase64(psbt).extractTransaction().getId(),
      psbt,
      type: "transfer",
    };

    let result = await api(req.headers)
      .post({ query: createTransaction, variables: { transaction } })
      .json();

    if (result.errors) throw new Error(result.errors[0].message);
    transfer_id = result.data.insert_transactions_one.id;

    let { users } = await q(getUserByAddress, { address });

    if (users.length) {
      let { id } = users[0];

      transaction.user_id = id;
      transaction.type = "receipt";
      let { insert_transactions_one: r } = await q(createTransaction, {
        transaction,
      });
      receipt_id = r.id;

      await q(updateArtwork, {
        artwork: {
          owner_id: id,
        },
        id: transaction.artwork_id,
      });
    }

    try {
      await broadcast(Psbt.fromBase64(transaction.psbt));
    } catch (e) {
      if (users.length) {
        await q(deleteTransaction, { id: receipt_id });
        await q(updateArtwork, {
          artwork: {
            owner_id: sender.id,
          },
          id: transaction.artwork_id,
        });
      }

      throw e;
    }

    res.send({});
  } catch (e) {
    try {
      await q(deleteTransaction, { id: transfer_id });
    } catch (e) {
      console.log("failed to rollback transfer transaction", e);
    }

    console.log("problem transferring artwork", e);
    res.code(500).send(e.message);
  }
});

app.post("/held", async (req, res) => {
  try {
    let { artworks_by_pk: artwork } = await q(getArtwork, { id: req.body.id });
    let { asset, owner } = artwork;
    let { address, multisig } = owner;

    let find = async (a) =>
      (await lnft.url(`/address/${a}/utxo`).get().json()).find(
        (tx) => tx.asset === asset
      );

    let held = null;
    if (await find(address)) held = "single";
    if (await find(multisig)) held = "multisig";

    let result = await q(setHeld, { id: req.body.id, held });

    res.send({});
  } catch (e) {
    console.log(e);
    res.code(500).send(e.message);
  }
});

app.post("/viewed", async (req, res) => {
  try {
    let { update_artworks_by_pk } = await q(updateViews, { id: req.body.id });
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

    let result = await api(req.headers)
      .post({ query: createTransaction, variables: { transaction } })
      .json();

    if (result.errors) throw new Error(result.errors[0].message);

    res.send(result.data.insert_transactions_one);
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
const issue = async (issuance, ids, { artwork, transactions, user_id }) => {
  issuances[issuance] = { length: transactions.length, i: 0 };
  let tries = 0;
  let i = 0;
  let contract, psbt;

  let tags = artwork.tags.map(({ tag }) => ({
    tag,
    artwork_id: artwork.id,
  }));

  delete artwork.tags;

  artwork.artist_id = user_id;
  artwork.owner_id = user_id;

  while (i < transactions.length && tries < 60) {
    await sleep(600);
    try {
      artwork.id = ids[i];
      artwork.edition = i + 1;
      artwork.slug = kebab(artwork.title || "untitled");
      tags.map((tag) => (tag.artwork_id = ids[i]));

      if (i > 0) artwork.slug += "-" + i + 1;
      artwork.slug += "-" + artwork.id.substr(0, 5);

      ({ contract, psbt } = transactions[i]);
      let p = Psbt.fromBase64(psbt);

      try {
        await broadcast(p);
      } catch (e) {
        if (!e.message.includes("already")) throw e;
      }

      let tx = p.extractTransaction();
      let hash = tx.getId();
      contract = JSON.stringify(contract);
      artwork.asset = parseAsset(
        tx.outs.find((o) => parseAsset(o.asset) !== btc).asset
      );

      await q(createArtwork, {
        artwork,
        transaction: {
          artwork_id: artwork.id,
          user_id: artwork.artist_id,
          type: "creation",
          hash,
          contract,
          asset: artwork.asset,
          amount: 1,
          psbt: p.toBase64(),
        },
        tags,
      });

      tries = 0;
      issuances[issuance].i = ++i;
      issuances[issuance].asset = artwork.asset;

      console.log("issued", artwork.slug);
    } catch (e) {
      console.log("failed issuance", e, artwork, psbt);
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
  let tries = 0;
  try {
    let { address, id: user_id } = await getUser(req);
    let { artwork, transactions } = req.body;
    let issuance = v4();
    let ids = transactions.map((t) => v4());
    issue(issuance, ids, {
      artwork,
      transactions,
      user_id,
    });
    let slug = kebab(artwork.title || "untitled") + "-" + ids[0].substr(0, 5);

    await wait(async () => {
      if (++tries > 40) throw new Error("Issuance timed out");
      if (!(issuances[issuance].i > 0)) return false;
      let utxos = await lnft.url(`/address/${address}/utxo`).get().json();
      return utxos.find((tx) => tx.asset === issuances[issuance].asset);
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

app.post("/comment", auth, async (req, res) => {
  try {
    let { amount, comment: commentBody, psbt, artwork_id } = req.body;

    let {
      artworks_by_pk: { owner_id },
    } = await q(getArtwork, { id: artwork_id });
    let user = await getUser(req);

    if (user.id !== owner_id) {
      let transaction = {
        amount,
        artwork_id,
        asset: btc,
        hash: Psbt.fromBase64(psbt).extractTransaction().getId(),
        user_id: user.id,
        psbt,
        type: "comment",
      };

      await q(createTransaction, { transaction });
    }

    let comment = {
      artwork_id,
      user_id: user.id,
      comment: commentBody,
    };

    let r = await q(createComment, { comment });

    res.send({ ok: true });
  } catch (e) {
    console.log(e);
    res.code(500).send(e.message);
  }
});
