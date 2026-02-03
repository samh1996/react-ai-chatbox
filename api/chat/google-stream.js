import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.GOOGLE_AI_API_KEY) {
    return res.status(500).json({ error: "Google AI API key not configured" });
  }

  const { content, messages = [], model = "gemini-2.5-flash" } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const genAI = new GoogleGenAI(process.env.GOOGLE_AI_API_KEY);
    const aiModel = genAI.getGenerativeModel({ model });

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

    // Set up streaming response
    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
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

    if (!res.headersSent) {
      return res.status(500).json({
        error: "Failed to generate response",
        details: error.message,
      });
    }

    res.write(`Error: ${error.message}`);
    res.end();
  }
}
