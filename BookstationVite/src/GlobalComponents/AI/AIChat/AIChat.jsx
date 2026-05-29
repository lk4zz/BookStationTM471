import styles from "./AIChat.module.css";

//this the AI chat bubble
//using message role to decide the color of the bubble wether its user or AI
function AIChat({ messages }) {
  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatBubbleContainer}>
        {messages?.map((message) => (
          <div
            className={`${styles.bubble} ${
              message.role === "user" ? styles.chatBubbleUser : styles.chatBubbleAI
            }`}
            key={message.id ?? `${message.role}-${message.content}`}
          >
            {message.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AIChat;