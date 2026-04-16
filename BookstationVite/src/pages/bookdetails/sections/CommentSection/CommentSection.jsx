import styles from "./CommentSection.module.css";
import Comments from "./components/Comments/Comments";
import InputText from "../../../../components/UI/InputFields/InputText";
import Loading from "../../../../components/UI/Loading/Loading";

function CommentSection({ comments,
    isCommentsLoading, commentInput, setCommentInput, handleAddComment, submitCommentMutation }) {

    return (
        <div className={styles.commetscolumn}>
            <h3 className={styles.sectionTitle}>User Comments</h3>
            <div className={styles.scrollList}>
                {isCommentsLoading ? (
                    <Loading />
                ) : comments?.length > 0 ? (
                    comments?.map((comment) => (
                        <Comments key={comment.id} comment={comment} />
                    ))
                ) : (
                    <p>No comments yet.</p>
                )}
            </div>
            <div className={styles.commentInputWrapper}>
                <div />
                <InputText
                    value={commentInput}
                    onChange={setCommentInput}
                    onSubmit={handleAddComment}
                    placeholder="Add a Comment"
                    disabled={submitCommentMutation.isPending}
                />
            </div>
        </div>
    )
}

export default CommentSection;
