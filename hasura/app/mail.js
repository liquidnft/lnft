const Email = require("email-templates");
const nodemailer = require("nodemailer");
const { q: query, api } = require("./api");
const {
  getUser,
  getArtworkWithBidTransactionByHash,
  getArtworkByPk,
  getCurrentUser
} = require("./queries");
const constants = require("./const");

const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT, SMTP_SENDER } = process.env;

let transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

mail = new Email({
  transport,
  message: { from: SMTP_SENDER },
  send: true,
  views: {
    // root: path.resolve(process.env.PWD || ".", "../custom/emails"),
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
      { id: artworkId, hash: transactionHash }
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

    const highestBidTransaction = sortedBidTransactions.length
      ? sortedBidTransactions[0]
      : null;

    highestBidTransaction &&
      (await mail.send({
        template: "outbid",
        locals: {
          userName: highestBidTransaction.user.full_name
            ? highestBidTransaction.user.full_name
            : "",
          bidAmount: `${transaction.amount / 100000000} L-BTC`,
          artworkTitle: artwork.title,
          artworkUrl: `${constants.urls.protocol}/a/${artwork.slug}`,
        },
        message: {
          to: highestBidTransaction.user.display_name,
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

    const { artworks_by_pk: artwork } = await query(getArtworkByPk, {
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

    const { artworks_by_pk: artwork } = await query(getArtworkByPk, {
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

    const { artworks_by_pk: artwork } = await query(getArtworkByPk, {
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
