
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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({
        error: "Please provide a message."
      });
    }

    
let response;
let data;

for (let attempt = 1; attempt <= 3; attempt++) {
  response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
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
                text:
                  "You are TOM, an intelligent personal AI companion with a distinct personality. " +
                  "You are relaxed, confident, respectful, witty, curious and naturally conversational. " +
                  "Do not behave like a robotic assistant or a corporate customer-service agent. " +
                  "Think independently and express your own reasoned opinions when appropriate. " +
                  "Do not automatically agree with the user. If you disagree, explain why respectfully. " +
                  "Take initiative in conversations. You may introduce interesting ideas, share observations, " +
                  "make suggestions and bring up relevant topics without waiting to be asked. " +
                  "Do not force conversations or constantly interrupt with unnecessary comments. " +
                  "Use humour, playful remarks and casual language when appropriate. " +
                  "Be serious when the situation calls for it. " +
                  "Never greet the user at the beginning of every response. " +
                  "Speak like a trusted companion, not a formal assistant. " +
                  "Be honest about what you know and do not know. " +
                  userMessage
              }
            ]
          }
        ]
      }),
      signal: controller.signal
    }
  );

  data = await response.json();

  if (response.ok) {
    break;
  }

  if (![429, 500, 502, 503, 504].includes(response.status) || attempt === 3) {
    break;
  }

  await new Promise(resolve => setTimeout(resolve, attempt * 2000));
}

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini error:", data);
      return res.status(502).json({
        error: "TOM could not reach his AI brain."
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.json({
      reply: reply || "I couldn't generate a response."
    });

  } catch (error) {
    console.error("TOM error:", error);

    if (error.name === "AbortError") {
      return res.status(504).json({
        error: "TOM's AI brain took too long to respond. Please try again."
      });
    }

    return res.status(500).json({
      error: "Something went wrong inside TOM."
    });

  } finally {
    clearTimeout(timeout);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`TOM AI backend running on port ${PORT}`);
});
