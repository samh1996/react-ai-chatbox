export class Assistant {
  #model;
  name = "openai";

  constructor(model = "gpt-4o-mini") {
    this.#model = model;
  }

  createChat(messages = []) {
    console.log("Chat created with history:", messages.length, "messages");
  }

  async chat(content, messages = []) {
    try {
      const response = await fetch("/api/chat/openai-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          messages,
          model: this.#model,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      return text;
    } catch (error) {
      console.error("Error sending message to API:", error);
      throw error;
    }
  }

  async *chatStream(content, messages = []) {
    try {
      const response = await fetch("/api/chat/openai-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          messages,
          model: this.#model,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        if (chunk) {
          yield chunk;
        }
      }
    } catch (error) {
      console.error("Error streaming from API:", error);
      throw error;
    }
  }
}
