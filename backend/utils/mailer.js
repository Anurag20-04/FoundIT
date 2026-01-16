const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // ✅ MUST be true for 465
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

transporter.verify((err) => {
  if (err) {
    console.error("❌ SMTP CONFIG ERROR:", err);
  } else {
    console.log("✅ SMTP server ready");
  }
});

const sendMail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: `"FoundIT" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendMail;
