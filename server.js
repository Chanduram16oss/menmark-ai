const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// API KEY
const API_KEY = process.env.API_KEY;

// test route
app.get("/", (req, res) => {
    res.send("Menmark AI Server Running 🚀");
});

// main AI route
app.post("/api", async (req, res) => {
    try {
        const userMsg = req.body.message;

        if (!userMsg) {
            return res.json({ reply: "⚠️ Empty message" });
        }

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + API_KEY,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: userMsg }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        let reply = "⚠️ No response";

        if (
            data.candidates &&
            data.candidates[0] &&
            data.candidates[0].content &&
            data.candidates[0].content.parts
        ) {
            reply = data.candidates[0].content.parts[0].text;
        }

        res.status(200).json({ reply });

    } catch (err) {
        console.log("ERROR:", err);
        res.status(200).json({ reply: "❌ API Error" });
    }
});

// start server
app.listen(3000, () => {
    console.log("Server running");
});
