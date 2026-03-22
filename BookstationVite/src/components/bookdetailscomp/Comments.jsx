import styles from "./Comments.module.css";


function Comments ({comment}) {

    return (
        <div className={styles.container}>
            <li className={styles.comment}> {comment.commenter.name} <br/>{comment.comment}</li>
        </div>
    )
}

export default Comments;