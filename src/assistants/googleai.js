import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY });

export class Assistant {
  #model;
  #chat;
  name = "googleai";

  constructor(model = "gemini-3-flash-preview") {
    this.#model = model;
  }

  createChat(messages = []) {
    // Convert messages to Google AI format for chat history
    const history = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    this.#chat = ai.chats.create({
      model: this.#model,
      history: history,
    });
  }

  async chat(content, messages = []) {
    try {
      console.log("Sending content to AI:", content);

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
        model: this.#model,
        contents: history,
      });

      console.log("Received response from AI:", result);
      console.log("Response text:", result.response.text());
      return result.response.text();
    } catch (error) {
      console.error("Error sending message to AI:", error);
      throw error;
    }
  }

  async *chatStream(content, messages = []) {
    try {
      // Convert messages to Google AI format and include in history
      const history = messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      // Add current message to history
      history.push({
        role: "user",
        parts: [{ text: content }],
      });

      const result = await ai.models.generateContentStream({
        model: this.#model,
        contents: history,
      });

      for await (const chunk of result) {
        yield chunk.text;
      }
    } catch (error) {
      throw error;
    }
  }
}
