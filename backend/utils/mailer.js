const axios = require("axios");

const sendMail = async ({ to, subject, html }) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "FoundIT",
          email: process.env.EMAIL_FROM,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );
  } catch (err) {
    console.error(
      "❌ BREVO MAIL ERROR:",
      err.response?.data || err.message
    );
    throw err;
  }
};

module.exports = sendMail;
