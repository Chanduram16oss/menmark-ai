const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // Node < 18 के लिए जरूरी

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY; // .env में अपनी API_KEY डालें

// Root endpoint
app.get("/", (req, res) => {
  res.send("Menmark AI Server Running 🚀");
});

// AI endpoint
app.post("/api", async (req, res) => {
  try {
    const userMsg = req.body.message;

    // सिर्फ gemini-1.5-flash मॉडल इस्तेमाल
    const MODEL_NAME = "gemini-1.5-flash";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userMsg }]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("FULL DATA:", JSON.stringify(data, null, 2));

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

app.listen(3000, () => console.log("Server running on port 3000"));
