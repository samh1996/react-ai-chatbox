export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { content, messages = [], model = "gemini-1.5-flash" } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  if (!process.env.GOOGLE_AI_API_KEY) {
    return res.status(500).json({ error: "Google AI API key not configured" });
  }

  try {
    // Try different initialization approaches
    const { GoogleGenAI } = await import("@google/genai");

    let genAI;

    // Try object format first
    try {
      genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });
    } catch (error) {
      console.log("Object format failed, trying string format:", error.message);
      // Fallback to string format
      genAI = new GoogleGenAI(process.env.GOOGLE_AI_API_KEY);
    }

    // Try different model names if the default fails
    const modelsToTry = [
      model,
      "gemini-1.5-flash",
      "gemini-pro",
      "gemini-1.0-pro",
    ];
    let aiModel;
    let lastError;

    for (const modelName of modelsToTry) {
      try {
        aiModel = genAI.getGenerativeModel({ model: modelName });
        console.log(`Successfully created model: ${modelName}`);
        break;
      } catch (error) {
        console.log(`Failed to create model ${modelName}:`, error.message);
        lastError = error;
      }
    }

    if (!aiModel) {
      throw lastError || new Error("Failed to create any model");
    }

    // Convert messages to Google AI format
    const history = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    history.push({
      role: "user",
      parts: [{ text: content }],
    });

    console.log("Generating content...");

    // Use non-streaming first to test
    const result = await aiModel.generateContent({ contents: history });
    const response = await result.response;
    const text = response.text();

    // Return as plain text to match streaming format
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send(text);
  } catch (error) {
    console.error("Google AI Error:", {
      message: error.message,
      name: error.name,
      stack: error.stack?.split("\n").slice(0, 5),
    });

    res.status(500).json({
      error: "Failed to generate response",
      details: error.message,
      errorType: error.name,
      timestamp: new Date().toISOString(),
    });
  }
}
