const nodemailer = require("nodemailer");

/* =========================
   CREATE TRANSPORTER
========================= */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

/* =========================
   OPTIONAL: VERIFY SMTP
========================= */
transporter.verify((err) => {
  if (err) {
    console.error("❌ SMTP CONFIG ERROR:", err.message);
  } else {
    console.log("✅ SMTP server ready");
  }
});

/* =========================
   GENERIC SEND MAIL FUNCTION
========================= */
const sendMail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: `"FoundIT" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendMail;
