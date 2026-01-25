import { useState } from "react";
import styles from "./App.module.css";
import { Chat } from "./components/chat/Chat.jsx";
import { Controls } from "./components/Controls/Controls.jsx";
import { Assistant } from "./assistants/googleai.js";

function App() {
  const assistant = new Assistant();
  const [messages, setMessages] = useState([]);

  function addMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  async function handleContentSend(content) {
    addMessage({ role: "user", content });
    try {
      // const result = await chat.sendMessage({ message: content });
      const resultText = await assistant.chat(content);
      addMessage({ role: "assistant", content: resultText });
    } catch (error) {
      addMessage({
        role: "system",
        content: "Sorry, couldnt process your request." + error.message,
      });
      console.error("Error sending message to AI:", error);
    }
  }

  return (
    <div className={styles.App}>
      <header className={styles.Header}>
        <img className={styles.Logo} src="/chat-bot.png" />
        <h2 className={styles.Title}>AI Chatbox</h2>
      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages} />
      </div>
      <div>
        <Controls onSend={handleContentSend} />
      </div>
    </div>
  );
}

export default App;
