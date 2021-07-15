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
    root: path.resolve(process.env.PWD || ".", "../custom/emails"),
    options: {
      extension: "ejs",
    },
  },
});

app.post("/notify-outbid", async (req, res) => {
  try {
    await mail.send({
      template: "notify-outbid",
      locals: {
        potato: "fries",
      },
      message: {
        to: "asoltys@gmail.com",
      },
    });
  } catch (err) {
    console.error("Unable to send email");
    console.error(err);
    return res.code(204).send();
  }

  res.send("ok");
});
