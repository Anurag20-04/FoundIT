const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Optional but recommended (startup check)
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Mail server error:", err);
  } else {
    console.log("📧 Mail server ready");
  }
});

module.exports = async function sendMail({ to, subject, html }) {
  return transporter.sendMail({
    from: `"FoundIT" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });
};
