import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const app = express();
app.use(cors());
app.use(express.json());

// Initialize AI clients with error handling
let googleAI = null;
let openai = null;

console.log("🔍 Checking environment variables...");
console.log(
  "GOOGLE_AI_API_KEY:",
  process.env.GOOGLE_AI_API_KEY ? "✅ Found" : "❌ Missing",
);
console.log(
  "OPENAI_API_KEY:",
  process.env.OPENAI_API_KEY ? "✅ Found" : "❌ Missing",
);

if (process.env.GOOGLE_AI_API_KEY) {
  try {
    googleAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });
    console.log("✅ Google AI initialized");
  } catch (error) {
    console.error("❌ Failed to initialize Google AI:", error.message);
  }
} else {
  console.warn("⚠️  GOOGLE_AI_API_KEY not found");
}

if (process.env.OPENAI_API_KEY) {
  try {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log("✅ OpenAI initialized");
  } catch (error) {
    console.error("❌ Failed to initialize OpenAI:", error.message);
  }
} else {
  console.warn("⚠️  OPENAI_API_KEY not found");
}

// Google AI streaming endpoint
app.post("/api/chat/google-stream", async (req, res) => {
  if (!googleAI) {
    return res.status(500).json({
      error: "Google AI not initialized. Check your GOOGLE_AI_API_KEY.",
    });
  }

  const { content, messages = [], model = "gemini-2.5-flash" } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    // Convert messages to Google AI format
    const history = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    history.push({
      role: "user",
      parts: [{ text: content }],
    });

    const result = await googleAI.models.generateContentStream({
      model: model,
      contents: history,
    });

    for await (const chunk of result) {
      if (chunk.text) {
        res.write(chunk.text);
      }
    }

    res.end();
  } catch (error) {
    console.error("Google AI Error:", error);
    res.write(`Error: ${error.message}`);
    res.end();
  }
});

// OpenAI streaming endpoint
app.post("/api/chat/openai-stream", async (req, res) => {
  if (!openai) {
    return res
      .status(500)
      .json({ error: "OpenAI not initialized. Check your OPENAI_API_KEY." });
  }

  const { content, messages = [], model = "gpt-4" } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    const stream = await openai.chat.completions.create({
      model: model,
      messages: [...messages, { content, role: "user" }],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(content);
      }
    }

    res.end();
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.write(`Error: ${error.message}`);
    res.end();
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    googleAI: googleAI ? "initialized" : "not initialized",
    openai: openai ? "initialized" : "not initialized",
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log("📝 Available endpoints:");
  console.log("  POST /api/chat/google-stream");
  console.log("  POST /api/chat/openai-stream");
  console.log("  GET  /api/health");
});
