import styles from "./Sidebar.module.css";
import { FaHamburger } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

export function Sidebar({
  chats,
  activeChatId,
  activeChatMessages,
  onActiveChatIdChange,
  onNewChatCreate,
}) {
  const [isOpen, setIsOpen] = useState(true);

  function handleSidebarToggle() {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }

  function handleOnKeyDown(event) {
    if (isOpen && event.key === "Escape") {
      setIsOpen(false);
    }
  }

  function handleChatClick(chatId) {
    onActiveChatIdChange(chatId);

    if (isOpen) {
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
        <button
          onClick={onNewChatCreate}
          disabled={activeChatMessages.length === 0}
          className={styles.NewChatButton}
        >
          New Chat
        </button>

        <ul className={styles.Chats}>
          {chats
            .filter(({ messages }) => messages.length > 0)
            .map((chat) => (
              <li
                key={chat.id}
                data-active={chat.id === activeChatId}
                className={styles.Chat}
                onClick={() => handleChatClick(chat.id)}
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
