import styles from "./Chat.module.css";

// const Chat = (messages) => {
//   return (
//     <div>
//       {messages.map(({ role, content }) => (
//         <div>{content}</div>
//       ))}
//     </div>
//   );
// };

// export default Chat;

// This way also works
export function Chat({ messages }) {
  return (
    <div className={styles.Chat}>
      {messages.map(({ role, content }, index) => (
        <div key={index} data-role={role} className={styles.Message}>
          {content}
        </div>
      ))}
    </div>
  );
}
