import { useState } from "react";
import styles from "./App.module.css";
import Chat from "./components/chat/Chat.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className={styles.App}>
      <header className={styles.Header}>
        <img className={styles.Logo} src="/chat-bot.png" />
        <h2 className={styles.Title}>AI Chatbox</h2>
      </header>
      <div className={styles.ChatContainer}>
        <Chat />
      </div>
    </div>
  );
}

export default App;
