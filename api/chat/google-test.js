export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // TEMPORARY: Hardcode API key for testing (REMOVE AFTER TESTING!)
  const apiKey =
    process.env.GOOGLE_AI_API_KEY || "AIzaSyDzp2erDQwNSQ2llo6DflBsNtka94DvdPc";

  console.log("API Key check:", {
    fromEnv: !!process.env.GOOGLE_AI_API_KEY,
    hasKey: !!apiKey,
    keyLength: apiKey?.length || 0,
  });

  const { content, messages = [], model = "gemini-1.5-flash" } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const { GoogleGenAI } = await import("@google/genai");
    const genAI = new GoogleGenAI(apiKey);
    const aiModel = genAI.getGenerativeModel({ model });

    const history = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    history.push({
      role: "user",
      parts: [{ text: content }],
    });

    const result = await aiModel.generateContent({ contents: history });
    const response = await result.response;
    const text = response.text();

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send(text);
  } catch (error) {
    console.error("Google AI Error:", error);
    res.status(500).json({
      error: "Failed to generate response",
      details: error.message,
    });
  }
}
