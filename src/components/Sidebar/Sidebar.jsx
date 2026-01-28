import styles from "./Sidebar.module.css";
import { FaHamburger } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

const CHATS = [
  {
    id: 1,
    title: "How to use AI Tools API in React Application",
  },
  {
    id: 2,
    title: "Gemini AI vs ChatGPT",
  },
  {
    id: 3,
    title: "Comparising Models for Popular AI Tools",
  },
  {
    id: 4,
    title: "How to use AI tools in your daily life",
  },
  {
    id: 5,
    title: "How to use AI tools in your daily work",
  },
];

export function Sidebar({ chats = CHATS, activeChatId = 1 }) {
  const [isOpen, setIsOpen] = useState(true);

  function handleSidebarToggle() {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }

  function handleOnKeyDown(event) {
    if (isOpen && event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <>
      <button
        className={styles.MenuButton}
        onClick={handleSidebarToggle}
        onKeyDown={handleOnKeyDown}
      >
        <FaHamburger size={24} />
      </button>

      <div className={styles.Sidebar} data-open={isOpen}>
        <ul className={styles.Chats}>
          {chats.map((chat) => (
            <li
              key={chat.id}
              data-active={chat.id === activeChatId}
              className={styles.Chat}
            >
              <button className={styles.ChatButton}>
                <div className={styles.ChatTitle}>{chat.title}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {isOpen && (
        <div className={styles.Overlay} onClick={handleSidebarToggle}></div>
      )}
    </>
  );
}
