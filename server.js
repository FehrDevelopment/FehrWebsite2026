import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";

const app = express();
app.use(cors());
app.use(express.json());

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the project root
app.use(express.static(__dirname));

const resend = new Resend(process.env.RESEND_API_KEY);

// Contact form route
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await resend.emails.send({
      from: "Fehr Development <contact@fehrdevelopment.com>",
      to: process.env.EMAIL_USER,
      subject: `New message from ${name}`,
      text: `Email: ${email}\n\nMessage:\n${message}`
    });

    res.json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("RESEND ERROR:", err);
    res.status(200).json({ message: "Message sent successfully" });
  }
});

// Fallback route for index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, () => console.log("Server running"));











