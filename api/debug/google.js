export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const hasApiKey = !!process.env.GOOGLE_AI_API_KEY;
    const apiKeyLength = process.env.GOOGLE_AI_API_KEY?.length || 0;

    // Test Google AI initialization
    let initTest = "failed";
    let modelTest = "failed";
    let errorDetails = null;

    try {
      const { GoogleGenAI } = await import("@google/genai");
      const genAI = new GoogleGenAI(process.env.GOOGLE_AI_API_KEY);
      initTest = "success";

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      modelTest = "success";
    } catch (error) {
      errorDetails = {
        message: error.message,
        name: error.name,
        stack: error.stack?.split("\n").slice(0, 3),
      };
    }

    res.json({
      timestamp: new Date().toISOString(),
      environment: "vercel",
      googleAI: {
        hasApiKey,
        apiKeyLength,
        initTest,
        modelTest,
        errorDetails,
      },
      nodeVersion: process.version,
      platform: process.platform,
    });
  } catch (error) {
    res.status(500).json({
      error: "Debug failed",
      details: error.message,
    });
  }
}
