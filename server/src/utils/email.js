import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env correctly
dotenv.config({ path: join(__dirname, "../../.env") });

console.log("EMAIL INIT USER:", process.env.EMAIL_USER);
console.log("EMAIL INIT PASS:", process.env.EMAIL_PASS ? "LOADED" : "MISSING");

// Transporter INSIDE function — ensures correct env
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
      text: text || "This message has no text content."
    };

    await transporter.sendMail(mailOptions);

    console.log("📩 Email sent to:", to);
  } catch (err) {
    console.error("❌ Email Error:", err);
  }
};
