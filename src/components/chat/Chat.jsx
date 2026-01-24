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
    <div>
      {messages.map(({ role, content }) => (
        <div>{content}</div>
      ))}
    </div>
  );
}
