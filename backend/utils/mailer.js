const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const api = new SibApiV3Sdk.TransactionalEmailsApi();

module.exports = async function sendMail({ to, subject, html }) {
  return api.sendTransacEmail({
    sender: {
      email: process.env.EMAIL_FROM,
      name: "FoundIT"
    },
    to: [{ email: to }],
    subject,
    htmlContent: html
  });
};
