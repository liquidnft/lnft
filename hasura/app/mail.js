import Email from "email-templates";
import nodemailer from "nodemailer";
import path from "path";
import { q as query, api } from "./api.js";
import { app } from "./app.js";
import { auth } from "./auth.js";

import {
  getUser,
  getArtworkWithBidTransactionByHash,
  getArtwork,
  getCurrentUser,
  getTransferTransactionsByPsbt,
} from "./queries.js";

import constants from "./const.js";

const {
  SMTP_HOST,
  SMTP_USER,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_SENDER,
  AUTH_EVENT_VALUE,
} = process.env;
const TRANSACTION_DEPOSIT = "deposit";
const TRANSACTION_RECEIPT = "receipt";
const TRANSACTION_WITHDRAWAL = "withdrawal";

let transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const mail = new Email({
  transport,
  message: { from: SMTP_SENDER },
  send: true,
  views: {
    root: path.resolve(process.env.PWD || ".", "emails"),
    options: {
      extension: "ejs",
    },
  },
});

app.post("/mail-artist-application-approved", auth, async (req, res) => {
  try {
    const { userId: id } = req.body;
    if (!id) {
      return res.code(400).send("Missing userId parameter.");
    }
    let { users_by_pk: user } = await query(getUser, { id });

    await mail.send({
      template: "artist-application-approved",
      locals: {
        artistName: user.full_name,
      },
      message: {
        to: user.display_name,
      },
    });

    return res.send("ok");
  } catch (err) {
    console.error(err);
    return res.code(400).send();
  }
});

app.post("/mail-artist-application-denied", auth, async (req, res) => {
  try {
    const { userId: id } = req.body;
    if (!id) {
      return res.code(400).send("Missing userId parameter.");
    }
    const { users_by_pk: user } = await query(getUser, { id });

    await mail.send({
      template: "artist-application-denied",
      locals: {
        artistName: user.full_name,
      },
      message: {
        to: user.display_name,
      },
    });

    return res.send("ok");
  } catch (err) {
    console.error(err);
    return res.code(400).send();
  }
});

app.post("/offer-notifications", auth, async (req, res) => {
  try {
    const { artworkId, transactionHash } = req.body;

    let { data, errors } = await api(req.headers)
      .post({ query: getCurrentUser })
      .json();

    if (errors) throw new Error(errors[0].message);
    let currentUser = data.currentuser[0];

    const { artworks_by_pk: artwork, transactions } = await query(
      getArtworkWithBidTransactionByHash,
      {
        id: artworkId,
        hash: transactionHash,
      }
    );

    const transaction = transactions.length ? transactions[0] : null;

    if (!transaction || !artwork) {
      return res
        .code(400)
        .send(`Missing ${!artwork ? "artwork" : "transaction"}`);
    }

    const sortedBidTransactions = artwork.transactions.sort(
      (a, b) => b.amount - a.amount
    );

    const outbiddedTransaction =
      sortedBidTransactions.length > 1 ? sortedBidTransactions[1] : null;

    const highestBidderIsCurrentBidder =
      outbiddedTransaction?.user?.display_name === currentUser.display_name;

    outbiddedTransaction &&
      !highestBidderIsCurrentBidder &&
      (await mail.send({
        template: "outbid",
        locals: {
          userName: outbiddedTransaction.user.full_name
            ? outbiddedTransaction.user.full_name
            : "",
          bidAmount: `${transaction.amount / 100000000} L-BTC`,
          artworkTitle: artwork.title,
          artworkUrl: `${constants.urls.protocol}/a/${artwork.slug}`,
        },
        message: {
          to: outbiddedTransaction.user.display_name,
        },
      }));

    await mail.send({
      template: "bid-processed",
      locals: {
        userName: currentUser.full_name,
        bidAmount: `${transaction.amount / 100000000} L-BTC`,
        artworkTitle: artwork.title,
        artworkUrl: `${constants.urls.protocol}/a/${artwork.slug}`,
      },
      message: {
        to: currentUser.display_name,
      },
    });

    await mail.send({
      template: "someone-bid",
      locals: {
        userName: artwork.owner.full_name ? artwork.owner.full_name : "",
        bidAmount: `${transaction.amount / 100000000} L-BTC`,
        artworkTitle: artwork.title,
        artworkUrl: `${constants.urls.protocol}/a/${artwork.slug}`,
      },
      message: {
        to: artwork.owner.display_name,
      },
    });

    return res.send("ok");
  } catch (err) {
    console.error(err);
    return res.code(400).send();
  }
});

app.post("/mail-purchase-successful", auth, async (req, res) => {
  try {
    const { userId: id, artworkId } = req.body;
    if (!id) {
      return res.code(400).send("Missing userId parameter.");
    }
    let { users_by_pk: user } = await query(getUser, { id });

    const { artworks_by_pk: artwork } = await query(getArtwork, {
      id: artworkId,
    });

    if (!artwork) {
      return res.code(400).send(`Missing artwork.`);
    }

    await mail.send({
      template: "purchase-successful",
      locals: {
        userName: user.full_name,
        bidAmount: `${artwork.list_price / 100000000} L-BTC`,
        artworkTitle: artwork.title,
        artworkUrl: `${constants.urls.protocol}/a/${artwork.slug}`,
      },
      message: {
        to: user.display_name,
      },
    });

    return res.send("ok");
  } catch (err) {
    console.error(err);
    return res.code(400).send();
  }
});

app.post("/mail-artwork-minted", auth, async (req, res) => {
  try {
    const { userId: id, artworkId } = req.body;
    if (!id) {
      return res.code(400).send("Missing userId parameter.");
    }
    let { users_by_pk: user } = await query(getUser, { id });

    const { artworks_by_pk: artwork } = await query(getArtwork, {
      id: artworkId,
    });

    if (!artwork) {
      return res.code(400).send(`Missing artwork.`);
    }

    await mail.send({
      template: "artwork-minted",
      locals: {
        userName: user.full_name,
        artworkTitle: artwork.title,
        artworkUrl: `${constants.urls.protocol}/a/${artwork.slug}`,
      },
      message: {
        to: user.display_name,
      },
    });

    return res.send("ok");
  } catch (err) {
    console.error(err);
    return res.code(400).send();
  }
});

app.post("/mail-artwork-sold", auth, async (req, res) => {
  try {
    const { userId: id, artworkId } = req.body;
    if (!id) {
      return res.code(400).send("Missing userId parameter.");
    }
    let { users_by_pk: user } = await query(getUser, { id });

    const { artworks_by_pk: artwork } = await query(getArtwork, {
      id: artworkId,
    });

    if (!artwork) {
      return res.code(400).send(`Missing artwork.`);
    }

    await mail.send({
      template: "artwork-sold",
      locals: {
        userName: user.full_name,
        bidAmount: artwork.list_price,
        artworkTitle: artwork.title,
        artworkUrl: `${constants.urls.protocol}/a/${artwork.slug}`,
      },
      message: {
        to: user.display_name,
      },
    });

    return res.send("ok");
  } catch (err) {
    console.error(err);
    return res.code(400).send();
  }
});

app.post("/mail-event-actions", async (req, res) => {
  if (!req.headers.auth_event || req.headers.auth_event !== AUTH_EVENT_VALUE) {
    res.status(401).send("Unauthorized!");
  }
  const transaction = req.body.event.data.new;

  const getUserById = async (userId) => {
    let { users_by_pk: user } = userId
      ? await query(getUser, { id: userId })
      : { users_by_pk: null };

    return user;
  };

  const getArtworkById = async (artworkId) => {
    let { artworks_by_pk: artwork } = artworkId
      ? await query(getArtwork, {
          id: artworkId,
        })
      : { artworks_by_pk: null };

    return artwork;
  };

  const getTransferTransaction = async (psbt) => {
    let { transactions } = psbt
      ? await query(getTransferTransactionsByPsbt, {
          psbt,
        })
      : { transactions: null };

    return transactions.length ? transactions[0] : null;
  };

  switch (transaction.type) {
    case TRANSACTION_DEPOSIT:
      if (transaction.amount > 1) {
        // send deposit email
        const user = await getUserById(transaction.user_id);

        await mail.send({
          template: "wallet-funded",
          locals: {
            userName: user ? user.username : "",
            amount: `${transaction.amount / 100000000} L-BTC`,
          },
          message: {
            to: user.display_name,
          },
        });

        console.info(`Email sent for ${transaction.type} transaction type.`);
      }
      break;
    case TRANSACTION_RECEIPT:
      if (transaction.amount === 1) {
        // send transfer artwork email
        const receiver = await getUserById(transaction.user_id);
        const transferTransaction = await getTransferTransaction(
          transaction.psbt
        );
        const sender = await getUserById(transferTransaction.user_id);
        const artwork = await getArtworkById(transaction.artwork_id);

        await mail.send({
          template: "artwork-transfered",
          locals: {
            userName: receiver ? receiver.username : "",
            artworkName: artwork.title,
            senderName: sender ? sender.username : "",
          },
          message: {
            to: receiver.display_name,
          },
        });

        console.info(`Email sent for ${transaction.type} transaction type.`);
      }
      break;
    case TRANSACTION_WITHDRAWAL:
      if (transaction.amount < -1000) {
        // send withdrawal email
        const user = await getUserById(transaction.user_id);

        await mail.send({
          template: "wallet-withdrawal",
          locals: {
            userName: user ? user.username : "",
            amount: `${Math.abs(transaction.amount / 100000000)} L-BTC`,
          },
          message: {
            to: user.display_name,
          },
        });

        console.info(`Email sent for ${transaction.type} transaction type.`);
      }
      break;

    default:
      console.info(`No email action for ${transaction.type} configured.`);
  }

  return res.send("ok");
});
