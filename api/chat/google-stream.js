import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check if API key exists
  if (!process.env.GOOGLE_AI_API_KEY) {
    console.error("GOOGLE_AI_API_KEY is not set");
    return res.status(500).json({ error: "Google AI API key not configured" });
  }

  const { content, messages = [], model = "gemini-2.5-flash" } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    // Initialize Google AI with proper configuration
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

    // Set up Server-Sent Events
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    });

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

    const result = await ai.models.generateContentStream({
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
    console.error("Google AI Streaming Error:", error);

    // If response headers haven't been sent, send JSON error
    if (!res.headersSent) {
      return res.status(500).json({
        error: "Failed to generate response",
        details: error.message,
      });
    }

    // Otherwise write error to stream
    res.write(`Error: ${error.message}`);
    res.end();
  }
}
