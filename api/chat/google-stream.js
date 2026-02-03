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
    // Dynamic import to avoid module loading issues
    const { GoogleGenAI } = await import("@google/genai");

    console.log("Initializing GoogleGenAI...");
    const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

    console.log("Getting generative model...");
    console.log("Available methods:", Object.getOwnPropertyNames(genAI));

    // Try different method names that might exist
    let aiModel;
    if (typeof genAI.getGenerativeModel === "function") {
      aiModel = genAI.getGenerativeModel({ model });
    } else if (typeof genAI.getModel === "function") {
      aiModel = genAI.getModel({ model });
    } else if (typeof genAI.model === "function") {
      aiModel = genAI.model(model);
    } else {
      throw new Error(
        `No suitable model method found. Available methods: ${Object.getOwnPropertyNames(genAI)}`,
      );
    }

    console.log("Model created successfully");

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

    console.log("Starting content generation...");

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

    console.log("Streaming started...");

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        res.write(chunkText);
      }
    }

    console.log("Streaming completed");
    res.end();
  } catch (error) {
    console.error("Google AI Streaming Error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    if (!res.headersSent) {
      return res.status(500).json({
        error: "Failed to generate response",
        details: error.message,
        errorName: error.name,
      });
    }

    res.write(`Error: ${error.message}`);
    res.end();
  }
}
