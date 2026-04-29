const nodemailer = require("nodemailer");
 
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
 
  // Basic security — require a secret key so only your tool can call this
  const { to, subject, body, secret } = req.body;
 
  if (secret !== process.env.SEND_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
 
  if (!to || !subject || !body) {
    return res.status(400).json({ error: "Missing required fields: to, subject, body" });
  }
 
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_APP_PASSWORD,
      },
    });
 
    await transporter.sendMail({
      from: `"Carlos | TradeOpsLab" <${process.env.ZOHO_EMAIL}>`,
      to,
      subject,
      text: body,
    });
 
    return res.status(200).json({ success: true, message: `Email sent to ${to}` });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ error: "Failed to send email", detail: error.message });
  }
}
