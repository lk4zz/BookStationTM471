import BookDetails from "./sections/BookDetails/BookDetails";
import BookDescription from "./sections/BookDescription/BookDescription";
import styles from "./BookDetailsPage.module.css";
import Loading from "../../components/UI/Loading/Loading";
import CommentSection from "./sections/CommentSection/CommentSection";
import { useBookDetails } from "./features/useBookDetails";
import { useParams } from "react-router-dom";
import ChapterSection from "./sections/ChapterSection/ChapterSection";

function BookDetailsPage() {
  const { id } = useParams();
  const bookId = Number(id);

  const {
    book,
    isBookLoading,
    bookError,
    comments,
    isCommentsLoading,
    totalViews,
    commentInput,
    setCommentInput,
    handleAddComment,
    submitCommentMutation,
    chapters,
    isChapterLoading,
    publishedChapters,
  } = useBookDetails(bookId);

  if (!Number.isFinite(bookId)) {
    return <p className={styles.error}>Invalid book link.</p>;
  }

  if (isBookLoading) return <Loading />;
  if (bookError) return <p className={styles.error}>{bookError.message || "Error loading data."}</p>;

  return (
    <div className={styles.page}>

      <div className={styles.upperContainer}>

        <section>
          <BookDetails
            book={book}
            views={totalViews}
          />
        </section>

      </div>

      <div className={styles.lowerContainer}>

        <section className={styles.bookDescriptionColumn}>
          <h3 className={styles.sectionTitle}>Book Description</h3>
          <BookDescription book={book} />
        </section>

        <section className={styles.commentSectionColumn}>
          <CommentSection comments={comments}
            isCommentsLoading={isCommentsLoading}
            commentInput={commentInput}
            setCommentInput={setCommentInput}
            handleAddComment={handleAddComment}
            submitCommentMutation={submitCommentMutation} />
        </section>

        <section className={styles.chapterSectionColumn}>
          <ChapterSection
            chapters={chapters}
            isChapterLoading={isChapterLoading}
            publishedChapters={publishedChapters}
          />
        </section>

      </div>
    </div>
  );
}

export default BookDetailsPage;
