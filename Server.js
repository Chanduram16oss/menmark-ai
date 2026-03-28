const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

app.get("/", (req, res) => {
    res.send("Menmark AI Server Running 🚀");
});

app.post("/api", async (req, res) => {
    try {
        const userMsg = req.body.message;

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + API_KEY,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: userMsg }]
                    }]
                })
            }
        );

        const data = await response.json();

        console.log("FULL DATA:", JSON.stringify(data));

        // 🔥 SAFE RESPONSE
        let reply = "⚠️ AI जवाब नहीं दे पाया";

        try {
            reply = data.candidates[0].content.parts[0].text;
        } catch {
            reply = "⚠️ No response from AI";
        }

        res.json({ reply });

    } catch (err) {
        console.log("ERROR:", err);
        res.json({ reply: "❌ API Error" });
    }
});

app.listen(3000, () => console.log("Server running"));
