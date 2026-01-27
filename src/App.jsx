import { useState } from "react";
import styles from "./App.module.css";
import { Chat } from "./components/chat/Chat.jsx";
import { Controls } from "./components/Controls/Controls.jsx";
import { Assistant } from "./assistants/googleai.js";
// import { Assistant } from "./assistants/openai.js";
import { Loader } from "./components/Loader/Loader.jsx";

function App() {
  const assistant = new Assistant();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function updateLastMessageContent(content) {
    setMessages((prevMessages) =>
      prevMessages.map((message, index) =>
        index === prevMessages.length - 1
          ? { ...message, content: `${message.content}${content}` }
          : message,
      ),
    );
  }

  function addMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  async function handleContentSend(content) {
    addMessage({ role: "user", content });
    setIsLoading(true);
    try {
      const resultText = await assistant.chatStream(content);
      let isFirstChunk = false;

      for await (const chunk of resultText) {
        if (!isFirstChunk) {
          isFirstChunk = true;
          addMessage({ role: "assistant", content: "" });
          setIsLoading(false);
        }
        updateLastMessageContent(chunk);
      }
    } catch (error) {
      addMessage({
        role: "system",
        content: "Sorry, couldnt process your request." + error.message,
      });
      console.error("Error sending message to AI:", error);
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.App}>
      {isLoading && <Loader />}
      <header className={styles.Header}>
        <img className={styles.Logo} src="/chat-bot.png" />
        <h2 className={styles.Title}>AI Chatbox</h2>
      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages} />
      </div>
      <div className={styles.ControlsSection}>
        <Controls onSend={handleContentSend} isDisabled={isLoading} />
      </div>
    </div>
  );
}

export default App;
