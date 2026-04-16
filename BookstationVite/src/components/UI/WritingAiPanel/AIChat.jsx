import styles from "./AIChat.module.css";


function AIChat({ messages }) {

    return (
        <div className={styles.chatWindow} >
            <div className={styles.chatBubbleContainer}>
            {messages?.map((message) => (
                <div className={message.role === "user" ? `${styles.chatBubbleUser}` : `${styles.chatBubbleAI}` }
                key={message.id ?? `${message.role}-${message.content}`}
                >{message.content}</div>
            ))}
               
            </div>

        </div>
    )
}

export default AIChat;