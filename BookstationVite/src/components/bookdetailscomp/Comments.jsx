import styles from "./Comments.module.css";

function Comments({ comment }) {
  return (
    <div className={styles.commentCard}>
      <div className={styles.avatarPlaceholder}>
        {comment.commenter?.name?.charAt(0).toUpperCase() || "U"}
      </div>
      
      <div className={styles.commentContent}>
        <div className={styles.header}>
          <span className={styles.name}>{comment.commenter?.name || "Anonymous"}</span>
        </div>
        <p className={styles.text}>{comment.comment}</p>
      </div>
    </div>
  );
}

export default Comments;