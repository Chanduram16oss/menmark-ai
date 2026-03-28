const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const API_KEY = "AIzaSyDAnMYGVDaQbDIW7bjipDvPd1938VPnELs";

app.post("/api", async (req, res) => {
    try {
        const userMsg = req.body.message;

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + API_KEY,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userMsg }] }]
                })
            }
        );

        const data = await response.json();

        let reply = "AI Error";

        try {
            reply = data.candidates[0].content.parts[0].text;
        } catch (e) {}

        res.json({ reply });

    } catch (err) {
        res.json({ reply: "❌ Server Error" });
    }
});

app.listen(3000, () => console.log("Server running"));
