const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

module.exports = async function sendMail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log("📨 Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Mail error:", err);
    throw err;
  }
};
