export default async function handler(req, res) {
  try {
    // Basic environment check
    const hasKey = !!process.env.GOOGLE_AI_API_KEY;
    const keyLength = process.env.GOOGLE_AI_API_KEY?.length || 0;

    if (!hasKey) {
      return res.json({
        error: "No API key found",
        env: Object.keys(process.env).filter((key) => key.includes("GOOGLE")),
      });
    }

    // Try to import the library
    let importError = null;
    let GoogleGenAI = null;

    try {
      const module = await import("@google/genai");
      GoogleGenAI = module.GoogleGenAI;
    } catch (error) {
      importError = error.message;
    }

    if (importError) {
      return res.json({
        error: "Import failed",
        details: importError,
        hasKey,
        keyLength,
      });
    }

    // Try to initialize
    let initError = null;
    let genAI = null;

    try {
      genAI = new GoogleGenAI(process.env.GOOGLE_AI_API_KEY);
    } catch (error) {
      initError = error.message;
    }

    if (initError) {
      return res.json({
        error: "Initialization failed",
        details: initError,
        hasKey,
        keyLength,
      });
    }

    // Try to get model
    let modelError = null;
    let model = null;

    try {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } catch (error) {
      modelError = error.message;
    }

    if (modelError) {
      return res.json({
        error: "Model creation failed",
        details: modelError,
        hasKey,
        keyLength,
      });
    }

    // Try a simple generation
    let generateError = null;
    let result = null;

    try {
      result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: "Say hello" }],
          },
        ],
      });

      const response = await result.response;
      const text = response.text();

      return res.json({
        success: true,
        response: text,
        hasKey,
        keyLength,
      });
    } catch (error) {
      generateError = error.message;
    }

    return res.json({
      error: "Generation failed",
      details: generateError,
      hasKey,
      keyLength,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Unexpected error",
      details: error.message,
      stack: error.stack,
    });
  }
}
