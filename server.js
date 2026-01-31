const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors({
    origin: "https://fehrdevelopment.com"
}));

// Gmail transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "terence.fehr@gmail.com",
        pass: "gxfb zrqu kbna zwpf"
    }
});

app.post("/contact", async (req, res) => {
    const { name, email, business, message } = req.body;

    console.log("received:", req.body);

    const mailOptions = {
        from: "terence.fehr@gmail.com",
        replyTo: email,
        to: "terence.fehr@gmail.com",
        subject: "New Project Inquiry",
        text: `
Name: ${name}
Email: ${email}
Business: ${business}
Message:
${message}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));











