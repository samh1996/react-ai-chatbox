import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Debug logging
  console.log("Google AI API Key exists:", !!process.env.GOOGLE_AI_API_KEY);
  console.log("Request body:", req.body);

  // Check if API key exists
  if (!process.env.GOOGLE_AI_API_KEY) {
    console.error("GOOGLE_AI_API_KEY is not set");
    return res.status(500).json({ error: "Google AI API key not configured" });
  }

  const { content, messages = [], model = "gemini-1.5-flash" } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    // Initialize Google AI
    const genAI = new GoogleGenAI(process.env.GOOGLE_AI_API_KEY);
    const aiModel = genAI.getGenerativeModel({ model: model });

    // Convert messages to Google AI format
    const history = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Add current message
    history.push({
      role: "user",
      parts: [{ text: content }],
    });

    console.log("Sending to Google AI:", {
      model,
      historyLength: history.length,
    });

    // Set up streaming response
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    // Generate streaming response
    const result = await aiModel.generateContentStream({
      contents: history,
    });

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        res.write(chunkText);
      }
    }

    res.end();
  } catch (error) {
    console.error("Google AI Streaming Error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    // If response headers haven't been sent, send JSON error
    if (!res.headersSent) {
      return res.status(500).json({
        error: "Failed to generate response",
        details: error.message,
        type: error.name,
      });
    }

    // Otherwise write error to stream
    res.write(`Error: ${error.message}`);
    res.end();
  }
}
