export class Assistant {
  #model;
  name = "googleai";

  constructor(model = "gemini-2.5-flash") {
    this.#model = model;
  }

  createChat(messages = []) {
    // This method is kept for compatibility but not needed for API calls
    console.log("Chat created with history:", messages.length, "messages");
  }

  async chat(content, messages = []) {
    try {
      console.log("Sending content to API:", content);

      const response = await fetch(
        "http://localhost:3001/api/chat/google-stream",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
            messages,
            model: this.#model,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log("Received response from API:", text);
      return text;
    } catch (error) {
      console.error("Error sending message to API:", error);
      throw error;
    }
  }

  async *chatStream(content, messages = []) {
    try {
      const response = await fetch(
        "http://localhost:3001/api/chat/google-stream",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
            messages,
            model: this.#model,
          }),
        },
      );

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
