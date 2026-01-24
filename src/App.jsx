import { useState } from "react";
import styles from "./App.module.css";
import { Chat } from "./components/chat/Chat.jsx";

function App() {
  const [messages, setMessages] = useState(MESSAGES);

  return (
    <div className={styles.App}>
      <header className={styles.Header}>
        <img className={styles.Logo} src="/chat-bot.png" />
        <h2 className={styles.Title}>AI Chatbox</h2>
      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages} />
      </div>
    </div>
  );
}

const MESSAGES = [
  { role: "user", content: "Hello!" },
  { role: "assistant", content: "Hi there! How can I assist you today?" },
  { role: "user", content: "Can you tell me a joke?" },
  {
    role: "assistant",
    content:
      "Sure! Why did the scarecrow win an award? Because he was outstanding in his field!",
  },
  { role: "user", content: "Haha, that's a good one!" },
];

export default App;
