export class Assistant {
  #model;
  name = "googleai";

  constructor(model = "gemini-1.5-flash") {
    this.#model = model;
  }

  createChat(messages = []) {
    console.log("Chat created with history:", messages.length, "messages");
  }

  async chat(content, messages = []) {
    try {
      const response = await fetch("/api/chat/google-robust", {
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
      const response = await fetch("/api/chat/google-robust", {
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

      // For the robust endpoint, we get the full response at once
      const text = await response.text();

      // Simulate streaming by yielding the whole response
      if (text) {
        yield text;
      }
    } catch (error) {
      console.error("Error streaming from API:", error);
      throw error;
    }
  }
}
