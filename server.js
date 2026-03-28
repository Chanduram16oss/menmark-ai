const express = require("express");
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
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                { text: userMsg }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        console.log("FULL DATA:", JSON.stringify(data));

        let reply = "⚠️ AI जवाब नहीं दे पाया";

        if (
            data.candidates &&
            data.candidates[0] &&
            data.candidates[0].content &&
            data.candidates[0].content.parts &&
            data.candidates[0].content.parts[0]
        ) {
            reply = data.candidates[0].content.parts[0].text;
        }

        res.json({ reply });

    } catch (err) {
        console.log(err);
        res.json({ reply: "❌ Server Error" });
    }
});

app.listen(3000, () => console.log("Server running"));
