import { useQuery } from "@tanstack/react-query";
import { getBookById } from "../../api/books";
import { getChaptersFromBook } from "../../api/chapters";
import { getCommentsByBook, addComment } from "../../api/comments";
import { useParams, useNavigate } from "react-router-dom";
import BookDetails from "../../components/bookdetailscomp/BookDetails";
import BookDescription from "../../components/bookdetailscomp/BookDescription";
import BookChapters from "../../components/bookdetailscomp/BookChapters";
import Comments from "../../components/bookdetailscomp/Comments";
import styles from "./BookDetailsPage.module.css";
import { getViews } from "../../api/views";
import { useState } from "react";

function BookDetailsPage() {
  const [commentInput, setCommentInput] = useState("");
  const { id } = useParams();
  const numericId = Number(id);
  const navigate = useNavigate();

  const {
    data: bookData,
    isLoading: isBookLoading,
    error: bookError,
  } = useQuery({
    queryKey: ["book", numericId],
    queryFn: () => getBookById(numericId),
    enabled: Number.isFinite(numericId),
  });

  const {
    data: chaptersData,
    isLoading: isChapterLoading,
    error: chapterError,
  } = useQuery({
    queryKey: ["chapters", numericId],
    queryFn: () => getChaptersFromBook(numericId),
    enabled: Number.isFinite(numericId),
  });

  const { data: commentsData } = useQuery({
    queryKey: ["comments", numericId],
    queryFn: () => getCommentsByBook(numericId),
    enabled: Number.isFinite(numericId),
  });

  const { data: viewsData } = useQuery({
    queryKey: ["views", numericId],
    queryFn: () => getViews(numericId),
    enabled: Number.isFinite(numericId),
  });

  if (isBookLoading) return <p className={styles.loading}>Loading...</p>;
  if (bookError) return <p className={styles.error}>Error loading data.</p>;

  const book = bookData?.data ?? bookData;
  const chapters = chaptersData?.data ?? chaptersData ?? [];
  const comments = commentsData?.data ?? commentsData ?? [];
  const totalViews = viewsData?.data || 0;

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
              <p className={styles.loading}>Loading...</p>
            ) : chapters.length > 0 ? (
              chapters.map((chapter) => (
                <BookChapters key={chapter.id} chapter={chapter} />
              ))
            ) : (
              <p className={styles.emptyState}>No chapters available.</p>
            )}
          </div>
        </div>

        <div className={`${styles.column} ${styles.commentsColumn}`}>
          <h3 className={styles.sectionTitle}>User Comments</h3>
          <div className={styles.scrollList}>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Comments key={comment.id} comment={comment} />
              ))
            ) : (
              <p className={styles.emptyState}>No comments yet.</p>
            )}
          </div>
          <div className={styles.commentInputWrapper}>
            <div className={styles.avatarPlaceholder} />
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Add a Comment"
              className={styles.commentInput}
            />
            <button
              className={styles.commentSubmitButton}
              onClick={() => addComment(book.id, commentInput)}
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
