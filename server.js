
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("TOM AI backend is online!");
});

app.get("/health", (req, res) => {
  res.json({
    status: "online",
    assistant: "TOM",
    version: "2.0"
  });
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({
        error: "Please provide a message."
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "You are TOM, a friendly, intelligent personal AI assistant. Respond naturally, clearly and helpfully. " + userMessage
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini error:", data);
      return res.status(502).json({
        error: "TOM could not reach his AI brain."
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({
      reply: reply || "I couldn't generate a response."
    });

  } catch (error) {
    console.error("TOM error:", error);

    res.status(500).json({
      error: "Something went wrong inside TOM."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`TOM AI backend running on port ${PORT}`);
});
