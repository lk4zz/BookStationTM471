// BookDetailsPage.jsx
import { useParams } from "react-router-dom";
import { BookDetailsProvider, useBookDetailsContext } from "./context/BookDetailsContext"; // adjust path as needed
import BookDetails from "./sections/BookDetails/BookDetails";
import BookDescription from "./sections/BookDescription/BookDescription";
import CommentSection from "./sections/CommentSection/CommentSection";
import ChapterSection from "./sections/ChapterSection/ChapterSection";
import Loading from "../../GlobalComponents/Feedback/Loading/Loading";
import styles from "./BookDetailsPage.module.css";

// We separate the inner content so it can access the Context (which is provided by the wrapper below)
function BookDetailsPageContent() {
  // We only pull the loading and error states here for the page-level layout
  const { isBookLoading, bookError } = useBookDetailsContext();

  if (isBookLoading) return <Loading />;
  if (bookError) return <p className={styles.error}>{bookError.message || "Error loading data."}</p>;

  return (
    <div className={styles.page}>
      <div className={styles.upperContainer}>
        <section>
          {/* Props are gone! The component will grab what it needs from Context */}
          <BookDetails />
        </section>
      </div>

      <div className={styles.lowerContainer}>
        <section className={styles.bookDescriptionColumn}>
          <h3 className={styles.sectionTitle}>Book Description</h3>
          {/* Props are gone! */}
          <BookDescription />
        </section>

        <section className={styles.commentSectionColumn}>
          {/* Props are gone! */}
          <CommentSection />
        </section>

        <section className={styles.chapterSectionColumn}>
          {/* Props are gone! */}
          <ChapterSection />
        </section>
      </div>
    </div>
  );
}

// The main page component acts as the Context Wrapper
function BookDetailsPage() {
  const { id } = useParams();
  const bookId = Number(id);

  if (!Number.isFinite(bookId)) {
    return <p className={styles.error}>Invalid book link.</p>;
  }

  return (
    <BookDetailsProvider bookId={bookId}>
      <BookDetailsPageContent />
    </BookDetailsProvider>
  );
}

export default BookDetailsPage;