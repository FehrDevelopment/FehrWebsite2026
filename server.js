const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(cors({
    origin: "http://fehrdevelopment.com"
}));    

// Gmail transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "terence.fehr@gmail.com",
        pass: "chms bxhx wxgr ksoy"
    }
});

app.post("/contact", async (req, res) => {
    console.log( "received:", req.body);
    res.json({ success: true }); // Temporary response for testing

    const mailOptions = {
        from: email,
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

app.listen(3000, () => console.log("Server running on port 3000"));
