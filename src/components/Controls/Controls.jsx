import { BiSend } from "react-icons/bi";
import styles from "./Controls.module.css";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

export function Controls({ isDisabled = false, onSend }) {
  const textAreaRef = useRef(null);
  const [content, setContent] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Only auto-focus on desktop, not on mobile
    if (!isDisabled && !isMobile) {
      textAreaRef.current.focus();
    }
  }, [isDisabled, isMobile]);

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
        <TextareaAutosize
          className={styles.TextArea}
          placeholder="Message AI Chatbot"
          value={content}
          minRows={1}
          maxRows={10}
          onChange={handleContentChange}
          onKeyDown={handleEnterPress}
          disabled={isDisabled}
          ref={textAreaRef}
        />
      </div>
      <button
        className={styles.Button}
        onClick={handleContentSend}
        disabled={isDisabled}
      >
        <BiSend size={24} />
      </button>
    </div>
  );
}
