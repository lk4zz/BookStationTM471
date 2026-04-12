import styles from "./Comments.module.css";
import { resolveImageUrl } from "../../../utils/ImageUrl";


function Comments({ comment }) {
  //implement later on actual profile photo (not included in data base yet)
  const displayImage = resolveImageUrl(comment.commenter?.profileImage);

  return (
    <div className={styles.commentCard}>
      <div className={styles.avatarPlaceholder}>
        <img 
          src={displayImage}
          alt={comment.commenter?.name.charAt(0).toUpperCase() || "U"}
          className="avatarImage"
        />
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