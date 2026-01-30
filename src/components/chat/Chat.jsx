import { Messages } from "../Messages/Messages.jsx";
import { Controls } from "../Controls/Controls.jsx";
import { Loader } from "../Loader/Loader.jsx";
import { useEffect, useState } from "react";
import styles from "./Chat.module.css";

export function Chat({ assistant, chatId, chatMessages, onChatMessagesUpdate }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    setMessages(chatMessages);
  }, [chatId]);

  useEffect(() => {
    onChatMessagesUpdate(messages)
  }, [messages]);

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
      const resultText = await assistant.chatStream(content, messages);
      let isFirstChunk = false;

      for await (const chunk of resultText) {
        if (!isFirstChunk) {
          isFirstChunk = true;
          addMessage({ role: "assistant", content: "" });
          setIsLoading(false);
          setIsStreaming(true);
        }
        updateLastMessageContent(chunk);
      }
      setIsStreaming(false);
    } catch (error) {
      addMessage({
        role: "system",
        content: "Sorry, couldnt process your request." + error.message,
      });
      console.error("Error sending message to AI:", error);
      setIsLoading(false);
      setIsStreaming(false);
    }
  }

  return (
    <>
      {isLoading && <Loader />}
      <div className={styles.Chat}>
        <Messages messages={messages} />
      </div>
      <div className={styles.ControlsSection}>
        <Controls
          onSend={handleContentSend}
          isDisabled={isLoading || isStreaming}
        />
      </div>
    </>
  );
}
