import { useState } from "react";
import styles from "./App.module.css";
import { Chat } from "./components/chat/Chat.jsx";
import { Controls } from "./components/Controls/Controls.jsx";

function App() {
  const [messages, setMessages] = useState([]);
  
  function handleContentSend(content) {
    setMessages((prevMessages) => [...prevMessages, { role: "user", content }]);
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
        <Controls onSend={handleContentSend}/>
      </div>
    </div>
  );
}

export default App;
