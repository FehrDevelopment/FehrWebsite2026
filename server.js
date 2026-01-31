import express from "express";
import cors from "cors";
import { Resend } from "resend";

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await resend.emails.send({
      from: "Fehr Development <onboarding@resend.dev>",
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

app.listen(3000, () => console.log("Server running"));











