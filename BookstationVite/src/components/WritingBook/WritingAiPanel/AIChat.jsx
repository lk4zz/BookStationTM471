import styles from "./AIChat.module.css";


function AIChat({ messages }) {

    return (
        <div className={styles.chatWindow} >
            <div className={styles.chatBubbleContainer}>
            {messages?.map((message, index) => (
                <div className={message.role === "user" ? `${styles.chatBubbleUser}` : `${styles.chatBubbleAI}` }
                key={index} message={message.text}
                >{message.content}</div>
            ))}
               
            </div>

        </div>
    )
}

export default AIChat;