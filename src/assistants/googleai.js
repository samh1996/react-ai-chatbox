import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY });

export class Assistant {
  #chat;

  constructor() {
    this.#chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      history: [],
    });
  }

  async chat(content) {
    try {
      console.log("Sending content to AI:", content);
      const result = await this.#chat.sendMessage({ message: content });
      console.log("Received response from AI:", result);
      console.log("Response text:", result.text);
      return result.text;
    } catch (error) {
      console.error("Error sending message to AI:", error);
      throw error;
    }
  }
}
