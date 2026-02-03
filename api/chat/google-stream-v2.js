export default async function handler(req, res) {
  // Set timeout for Vercel
  res.setTimeout(30000);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Debug logging
  console.log("Environment check:", {
    hasGoogleKey: !!process.env.GOOGLE_AI_API_KEY,
    keyLength: process.env.GOOGLE_AI_API_KEY?.length || 0,
    nodeVersion: process.version,
  });

  if (!process.env.GOOGLE_AI_API_KEY) {
    console.error("GOOGLE_AI_API_KEY not found");
    return res.status(500).json({
      error: "Google AI API key not configured",
      availableEnvVars: Object.keys(process.env).filter((key) =>
        key.includes("GOOGLE"),
      ),
    });
  }

  const { content, messages = [], model = "gemini-1.5-flash" } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    console.log("Importing Google AI library...");
    const { GoogleGenAI } = await import("@google/genai");

    console.log("Initializing Google AI...");
    const genAI = new GoogleGenAI(process.env.GOOGLE_AI_API_KEY);

    console.log("Getting model...");
    const aiModel = genAI.getGenerativeModel({ model });

    // Convert messages
    const history = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    history.push({
      role: "user",
      parts: [{ text: content }],
    });

    console.log("Starting generation with history length:", history.length);

    // Set streaming headers
    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    // Generate with error handling
    const result = await aiModel.generateContentStream({ contents: history });

    console.log("Stream started successfully");

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        res.write(chunkText);
      }
    }

    console.log("Stream completed successfully");
    res.end();
  } catch (error) {
    console.error("Detailed error:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      cause: error.cause,
    });

    if (!res.headersSent) {
      return res.status(500).json({
        error: "Google AI request failed",
        details: error.message,
        errorType: error.name,
        timestamp: new Date().toISOString(),
      });
    }

    res.write(`\nError: ${error.message}`);
    res.end();
  }
}
