const Email = require("email-templates");
const nodemailer = require("nodemailer");
const path = require("path");

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
    const { artistName, to } = req.body;

    await mail.send({
      template: "artist-application-approved",
      locals: {
        artistName,
      },
      message: {
        to,
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
    const { artistName, to } = req.body;

    await mail.send({
      template: "artist-application-denied",
      locals: {
        artistName,
      },
      message: {
        to,
      },
    });

    return res.send("ok");
  } catch (err) {
    console.error(err);
    return res.code(400).send();
  }
});

app.post("/mail-bid-processed", auth, async (req, res) => {
  try {
    const { userName, to, artworkUrl, artworkTitle, bidAmount } = req.body;

    await mail.send({
      template: "bid-processed",
      locals: {
        userName,
        bidAmount,
        artworkTitle,
        artworkUrl,
      },
      message: {
        to,
      },
    });

    return res.send("ok");
  } catch (err) {
    console.error(err);
    return res.code(400).send();
  }
});

app.post("/mail-outbid", auth, async (req, res) => {
  try {
    const { userName, to, artworkUrl, artworkTitle, bidAmount } = req.body;

    await mail.send({
      template: "outbid",
      locals: {
        userName,
        bidAmount,
        artworkTitle,
        artworkUrl,
      },
      message: {
        to,
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
    const { userName, to, artworkUrl, artworkTitle, bidAmount } = req.body;

    await mail.send({
      template: "purchase-successful",
      locals: {
        userName,
        bidAmount,
        artworkTitle,
        artworkUrl,
      },
      message: {
        to,
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
    const { userName, to, artworkUrl, artworkTitle, bidAmount } = req.body;

    await mail.send({
      template: "artwork-minted",
      locals: {
        userName,
        artworkTitle,
        artworkUrl,
      },
      message: {
        to,
      },
    });

    return res.send("ok");
  } catch (err) {
    console.error(err);
    return res.code(400).send();
  }
});

app.post("/mail-someone-bid", auth, async (req, res) => {
  try {
    const { userName, to, artworkUrl, artworkTitle, bidAmount } = req.body;

    await mail.send({
      template: "someone-bid",
      locals: {
        userName,
        bidAmount,
        artworkTitle,
        artworkUrl,
      },
      message: {
        to,
      },
    });

    return res.send("ok");
  } catch (err) {
    console.error(err);
    return res.code(400).send();
  }
});

app.post("/mail-artwork-sold", auth, async (req, res) => {
  console.log("auth", auth)
  try {
    const { userName, to, artworkUrl, artworkTitle, bidAmount } = req.body;

    await mail.send({
      template: "artwork-sold",
      locals: {
        userName,
        bidAmount,
        artworkTitle,
        artworkUrl,
      },
      message: {
        to,
      },
    });

    return res.send("ok");
  } catch (err) {
    console.error(err);
    return res.code(400).send();
  }
});
