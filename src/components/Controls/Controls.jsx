import { BiSend } from "react-icons/bi";
import styles from "./Controls.module.css";
import { useState } from "react";

export function Controls({ onSend }) {
  const [content, setContent] = useState("");

  function handleContentChange(event) {
    setContent(event.target.value);
  }

  function handleContentSend() {
    if (content.length > 0) {
      onSend(content);
      setContent("");
    }
  }

  function handleEnterPress(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleContentSend();
    }
  }

  return (
    <div className={styles.Controls}>
      <div className={styles.TextAreaContainer}>
        <textarea
          className={styles.TextArea}
          placeholder="Message AI Chatbot"
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleEnterPress}
        />
      </div>
      <button className={styles.Button} onClick={handleContentSend}>
        <BiSend size={24} />
      </button>
    </div>
  );
}
