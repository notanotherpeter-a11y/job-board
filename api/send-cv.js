const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { to, company, role, message } = req.body || {};
  if (!to) return res.status(400).json({ error: "Recipient email required" });

  const cvPath = path.join(process.cwd(), "CV.pdf");
  const clPath = path.join(process.cwd(), "Cover_Letter.pdf");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const subject = company && role
    ? `Application – ${role} at ${company} | Gene Carlo Gallardo`
    : "Job Application – Gene Carlo Gallardo";

  const body = `Hi${company ? " " + company + " Team" : ""},

${message || "I am reaching out to express my interest in opportunities at your organisation. Please find my CV and cover letter attached for your review."}

I look forward to connecting.

Kind regards,
Gene Carlo Gallardo
AI Engineer | Sales & Marketing | Social Media Strategist
📞 0420 418 888 | 🌐 gene-carlo.com | ✉️ genecarloai@gmail.com`;

  try {
    await transporter.sendMail({
      from: `"Gene Carlo Gallardo" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: body,
      attachments: [
        { filename: "Gene_Carlo_Gallardo_CV.pdf", path: cvPath },
        { filename: "Gene_Carlo_Gallardo_Cover_Letter.pdf", path: clPath },
      ],
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Send error:", err);
    res.status(500).json({ error: err.message });
  }
};
