import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";

const app = express();

// --------------------------------------------------
// 1. JSON MUST COME FIRST
// --------------------------------------------------
app.use(express.json());

// --------------------------------------------------
// 2. CORS for live + local
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
// 4. Serve STATIC FILES from the REAL website root
//    (backend is inside /backend → go UP one folder)
// --------------------------------------------------
const rootPath = path.join(__dirname, "..");
app.use(express.static(rootPath));

// --------------------------------------------------
// 5. Resend setup
// --------------------------------------------------
const resend = new Resend(process.env.RESEND_API_KEY);

// --------------------------------------------------
// 6. Contact form route
// --------------------------------------------------
app.post("/contact", async (req, res) => {
  const { name, email, business, message } = req.body;

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
//    (serve the REAL index.html in the root folder)
// --------------------------------------------------
app.get("*", (req, res) => {
  res.sendFile(path.join(rootPath, "index.html"));
});

// --------------------------------------------------
// 8. Start server (Render FIXED)
// --------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));










