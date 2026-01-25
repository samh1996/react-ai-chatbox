import styles from "./Chat.module.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const WELCOME_MESSAGE = {
  role: "assistant",
  content: "Hello! I'm your AI Chatbot. How can I assist you today?",
};

export function Chat({ messages }) {
  return (
    <div className={styles.Chat}>
      {[WELCOME_MESSAGE, ...messages].map(({ role, content }, index) => (
        <div key={index} data-role={role} className={styles.Message}>
          <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
        </div>
      ))}
    </div>
  );
}
