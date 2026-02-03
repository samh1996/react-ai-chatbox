export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Use the correct environment variable name from your Vercel settings
  if (!process.env.GOOGLE_AI_API_KEY) {
    return res.status(500).json({ error: "Google AI API key not configured" });
  }

  const { content, messages = [], model = "gemini-1.5-flash" } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const { GoogleGenAI } = await import("@google/genai");
    const genAI = new GoogleGenAI(process.env.GOOGLE_AI_API_KEY);
    const aiModel = genAI.getGenerativeModel({ model });

    // Convert messages to Google AI format
    const history = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    history.push({
      role: "user",
      parts: [{ text: content }],
    });

    console.log("Generating content with Google AI...");
    const result = await aiModel.generateContent({ contents: history });
    const response = await result.response;
    const text = response.text();

    // Return as plain text to match streaming format
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send(text);
  } catch (error) {
    console.error("Google AI Error:", error);
    res.status(500).json({
      error: "Failed to generate response",
      details: error.message,
      name: error.name,
    });
  }
}
