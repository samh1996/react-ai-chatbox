export default async function handler(req, res) {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check environment variable
  if (!process.env.GOOGLE_AI_API_KEY) {
    console.error("GOOGLE_AI_API_KEY not found in environment");
    return res.status(500).json({ error: "Google AI API key not configured" });
  }

  const { content, messages = [], model = "gemini-1.5-flash" } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    // Dynamic import to avoid module loading issues in serverless
    const { GoogleGenAI } = await import("@google/genai");

    // Initialize with simple string format (some versions prefer this)
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

    console.log("Calling Google AI with model:", model);

    // Set up streaming response
    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    // Generate content with timeout handling
    const result = await Promise.race([
      aiModel.generateContentStream({ contents: history }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 25000),
      ),
    ]);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        res.write(chunkText);
      }
    }

    res.end();
  } catch (error) {
    console.error("Google AI Error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    if (!res.headersSent) {
      return res.status(500).json({
        error: "Failed to generate response",
        details: error.message,
        timestamp: new Date().toISOString(),
      });
    }

    res.write(`\n\nError: ${error.message}`);
    res.end();
  }
}
