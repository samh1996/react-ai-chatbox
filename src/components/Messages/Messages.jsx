import { useEffect, useRef, useMemo } from "react";
import styles from "./Messages.module.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const WELCOME_MESSAGE_GROUP = [
  {
    role: "assistant",
    content: "Hello! I'm your AI Chatbot. How can I assist you today?",
  },
];

export function Messages({ messages }) {
  const messagesEndRef = useRef(null);
  const messageGroups = useMemo(
    () =>
      messages.reduce((groups, message) => {
        if (message.role === "user") groups.push([]);
        groups[groups.length - 1].push(message);
        return groups;
      }, []),
    [messages],
  );

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.role === "user") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className={styles.Messages}>
      {[WELCOME_MESSAGE_GROUP, ...messageGroups].map((messages, groupIndex) => (
        // Group
        <div key={groupIndex} className={styles.Group}>
          {messages.map(({ role, content }, index) => (
            // Message
            <div key={index} className={styles.Message} data-role={role}>
              <Markdown>{content}</Markdown>
            </div>
          ))}
        </div>
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
}
