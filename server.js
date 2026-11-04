
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`TOM AI backend running on port ${PORT}`);
});
