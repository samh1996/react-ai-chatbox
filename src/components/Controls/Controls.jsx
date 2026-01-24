import { BiSend } from "react-icons/bi";
import styles from "./Controls.module.css";

export function Controls() {
  return (
    <div className={styles.Controls}>
      <div className={styles.TextAreaContainer}>
        <textarea
          className={styles.TextArea}
          placeholder="Message AI Chatbot"
        />
      </div>
      <button className={styles.Button}>
        <BiSend size={24} />
      </button>
    </div>
  );
}
