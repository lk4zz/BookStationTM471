import { useParams, useNavigate } from "react-router-dom";
import BookDetails from "../../components/bookdetailscomp/BookDetails";
import BookDescription from "../../components/bookdetailscomp/BookDescription";
import BookChapters from "../../components/bookdetailscomp/BookChapters";
import Comments from "../../components/bookdetailscomp/Comments";
import styles from "./BookDetailsPage.module.css";
import { useViews } from "../../hooks/useViews";
import { useState } from "react";
import { useBookById } from "../../hooks/useBooks";
import { useChaptersByBook } from "../../hooks/useChapters";
import { useCommentsByBook } from "../../hooks/useComments";
import { useAddComment } from "../../hooks/useComments";

function BookDetailsPage() {
  const { id } = useParams();
  const numericId = Number(id);
  const navigate = useNavigate();
  const [commentInput, setCommentInput] = useState("");
  const submitCommentMutation = useAddComment(numericId);

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    submitCommentMutation.mutate(commentInput, {
      onSuccess: () => {
        setCommentInput(""); 
      }
    });
  };

  const { book, isBookLoading, bookError } = useBookById(numericId);
  const { chapters, isChapterLoading } = useChaptersByBook(numericId);
  const { comments, isCommentsLoading } = useCommentsByBook(numericId);
  const { totalViews } = useViews(numericId);

  if (isBookLoading) return <p className={styles.loading}>Loading...</p>;
  if (bookError) return <p className={styles.error}>Error loading data.</p>;

  return (
    <div className={styles.page}>
      <div className={styles.upperContainer}>
        <BookDetails
          book={book}
          views={totalViews}
          onBack={() => navigate(-1)}
        />
      </div>

      <div className={styles.lowerContainer}>
        <div className={styles.column}>
          <h3 className={styles.sectionTitle}>Book Description</h3>
          <BookDescription book={book} />
        </div>

        <div className={styles.chaptercolumn}>
          <h3 className={styles.sectionTitle}>Chapters</h3>
          <div className={styles.scrollList}>
            {isChapterLoading ? (
              <p className="loading">Loading...</p>
            ) : chapters?.length > 0 ? (
              chapters.map((chapter) => (
                <BookChapters key={chapter.id} chapter={chapter} />
              ))
            ) : (
              <p className={styles.emptyState}>No chapters available.</p>
            )}
          </div>
        </div>

        <div className={styles.commetscolumn}>
          <h3 className={styles.sectionTitle}>User Comments</h3>
          <div className={styles.scrollList}>
            {comments?.length > 0 ? (
              comments.map((comment) => (
                <Comments key={comment.id} comment={comment} />
              ))
            ) : (
              <p className="loading">No comments yet.</p>
            )}
          </div>
          <div className={styles.commentInputWrapper}>
            <div className={styles.avatarPlaceholder} />
            <input
              type="text"
              value={commentInput}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Add a Comment"
              className={styles.commentInput}
            />
            <button
              className={styles.commentSubmitButton}
              onClick={handleAddComment}
              disabled={!commentInput.trim()}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetailsPage;
