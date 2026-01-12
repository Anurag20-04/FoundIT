const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function sendMail({ to, subject, html }) {
  console.log("RESEND KEY PRESENT:", !!process.env.RESEND_API_KEY);
  console.log("EMAIL_FROM:", process.env.EMAIL_FROM);

  return await resend.emails.send({
    from: "FoundIT <onboarding@resend.dev>",
    to: [to],
    subject,
    html,
  });
};
