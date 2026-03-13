import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";

const app = express();

// --------------------------------------------------
// 1. JSON MUST COME FIRST (fixes blank emails on Render)
// --------------------------------------------------
app.use(express.json());

// --------------------------------------------------
// 2. Correct CORS for both local + live site
// --------------------------------------------------
app.use(cors({
  origin: [
    "https://fehrdevelopment.com",
    "http://127.0.0.1:5500"
  ],
  methods: ["POST", "GET"],
  allowedHeaders: ["Content-Type"]
}));

// --------------------------------------------------
// 3. Fix __dirname for ES modules
// --------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------------------------------------
// 4. Serve static files (AFTER JSON + CORS)
// --------------------------------------------------
app.use(express.static(path.join(process.cwd())));

// --------------------------------------------------
// 5. Resend setup
// --------------------------------------------------
const resend = new Resend(process.env.RESEND_API_KEY);

// --------------------------------------------------
// 6. Contact form route (FULLY FIXED)
// --------------------------------------------------
app.post("/contact", async (req, res) => {
  const { name, email, business, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await resend.emails.send({
      from: "Fehr Development <contact@fehrdevelopment.com>",
      to: process.env.EMAIL_USER,
      subject: `New message from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Business: ${business || "N/A"}

Message:
${message}
      `
    });

    return res.json({ message: "Message sent successfully" });

  } catch (err) {
    console.error("RESEND ERROR:", err);
    return res.status(500).json({ message: "Email failed to send" });
  }
});

// --------------------------------------------------
// 7. Fallback route for SPA
// --------------------------------------------------
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// --------------------------------------------------
// 8. Start server
// --------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));












