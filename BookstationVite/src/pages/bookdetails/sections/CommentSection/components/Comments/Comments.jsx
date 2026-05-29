// sections/CommentSection/components/Comments/Comments.jsx
import styles from "./Comments.module.css";
import { resolveDocumentUrl } from "../../../../../../utils/ImageUrl";
import UserAvatar from "@/GlobalComponents/Layout/UserAvatar/UserAvatar";
import { useNavigate } from "react-router-dom";

function Comments({ comment }) {
  // Implement later on actual profile photo (not included in database yet)
  const displayImage = resolveDocumentUrl(comment.commenter?.profileImage);
  const navigate = useNavigate();


  return (
    <div className={styles.commentCard}>
        <UserAvatar
          profileUrl={displayImage}
          onClick={() => {navigate(`/author/${comment.commenter?.id}`)}}
        />

      
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