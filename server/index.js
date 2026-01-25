const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(cors());
app.use(express.json());

// instantiate GoogleGenAI on the server using server-side env var
const ai = new GoogleGenAI(process.env.GOOGLE_API_KEY);
const chat = ai.chats.create({
  model: "gemini-3-flash-preview",
  history: [],
});

app.post("/api/chat", async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "Missing content" });
  try {
    const result = await chat.sendMessage(content);
    res.json({ text: result.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
