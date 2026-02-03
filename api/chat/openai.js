import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { content, messages = [], model = "gpt-4" } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const response = await client.chat.completions.create({
      model: model,
      messages: [...messages, { content, role: "user" }],
    });

    res.json({
      text: response.choices[0].message.content,
      success: true,
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({
      error: "Failed to generate response",
      details: error.message,
    });
  }
}
