import styles from "./Sidebar.module.css";
import { FaHamburger } from "react-icons/fa";
import { useState, useEffect } from "react";

export function Sidebar({
  chats,
  activeChatId,
  activeChatMessages,
  onActiveChatIdChange,
  onNewChatCreate,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection with resize handling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check on mount
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  function handleNewChatClick() {
    onNewChatCreate();

    // Always close sidebar on mobile when creating new chat
    if (isMobile) {
      setIsOpen(false);
    }
  }

  // On mobile, don't disable the button when messages length is 0
  const shouldDisableNewChat = !isMobile && activeChatMessages.length === 0;

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
          onClick={handleNewChatClick}
          disabled={shouldDisableNewChat}
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
