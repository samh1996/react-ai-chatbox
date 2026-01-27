import OpenAI from "openai";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
  dangerouslyAllowBrowser: true, // Move the api key to the backend
});

export class Assistant {
  #model;

  constructor(model = "gpt-5-nano") {
    this.#model = model;
  }

  async chat(content, history) {
    try {
      const response = await client.responses.create({
        model: this.#model,
        input: [...history, { content, role: "user" }],
      });

      return response.output_text;
    } catch (error) {
      throw error;
    }
  }

  async *chatStream(content, history) {
    try {
      const stream = await client.responses.create({
        model: this.#model,
        input: [...history, { content, role: "user" }],
        stream: true,
      });

      for await (const event of stream) {
        // Responses API streaming emits event objects (not choices/delta).
        if (event.type === "response.output_text.delta") {
          yield event.delta ?? "";
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
