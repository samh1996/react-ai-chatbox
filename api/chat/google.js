import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI(process.env.GOOGLE_AI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { content, messages = [], model = "gemini-2.5-flash" } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
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

    const result = await ai.models.generateContent({
      model: model,
      contents: history,
    });

    res.json({
      text: result.response.text(),
      success: true,
    });
  } catch (error) {
    console.error("Google AI API Error:", error);
    res.status(500).json({
      error: "Failed to generate response",
      details: error.message,
    });
  }
}
