import { useParams, useNavigate } from "react-router-dom";
import BookDetails from "../../components/bookdetailscomp/BookDetails/BookDetails";
import BookDescription from "../../components/bookdetailscomp/BookDescription/BookDescription";
import BookChapters from "../../components/bookdetailscomp/BookChapter/BookChapters";
import Comments from "../../components/bookdetailscomp/Comments/Comments";
import styles from "./BookDetailsPage.module.css";
import { useViews } from "../../hooks/useViews";
import { useState } from "react";
import { useBookById } from "../../hooks/useBooks";
import { useChaptersByBook } from "../../hooks/useChapters";
import { useCommentsByBook } from "../../hooks/useComments";
import { useAddComment } from "../../hooks/useComments";
import InputText from "../../components/UI/InputFields/InputText";


//might need toclean could useless jsx and  they could be added to components
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
      },
    });
  };

  const { book, isBookLoading, bookError } = useBookById(numericId);
  const { chapters, isChapterLoading } = useChaptersByBook(numericId);
  const { comments, isCommentsLoading } = useCommentsByBook(numericId);
  const { totalViews } = useViews(numericId);

  if (isBookLoading) return <p className={styles.loading}>Loading...</p>;
  if (bookError) return <p className={styles.error}>{bookError.message || "Error loading data."}</p>;
  const publishedChapters = chapters?.filter((chapter) => chapter.isPublished);

  return (
    <div className={styles.page}>
      <div className={styles.upperContainer}>
        <BookDetails
          book={book}
          views={totalViews}
        />
      </div>

      <div className={styles.lowerContainer}>
        <div className={styles.column}>
          <h3 className={styles.sectionTitle}>Book Description</h3>
          <BookDescription book={book} />
        </div>

        <div className={styles.commetscolumn}>
          <h3 className={styles.sectionTitle}>User Comments</h3>
          <div className={styles.scrollList}>
            {comments?.length > 0 ? (
              comments?.map((comment) => (
                <Comments key={comment.id} comment={comment} />
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
          <div className={styles.commentInputWrapper}>
            <div className={styles.avatarPlaceholder} />
            <InputText
              value={commentInput}
              onChange={setCommentInput}
              onSubmit={handleAddComment}
              placeholder="Add a Comment"
              disabled={submitCommentMutation.isPending}
            />

          </div>
        </div>
        <div className={styles.chaptercolumn}>
          <h3 className={styles.sectionTitle}>Chapters</h3>
          <div className={styles.scrollList}>
            {isChapterLoading ? (
              <p className="loading">Loading...</p>
            ) : chapters?.length > 0 && publishedChapters?.length > 0? (
              chapters
              .map((chapter) => (
                <BookChapters key={chapter.id} chapter={chapter} />
              ))
            ) : (
              <p className={styles.emptyState}>No chapters available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetailsPage;
