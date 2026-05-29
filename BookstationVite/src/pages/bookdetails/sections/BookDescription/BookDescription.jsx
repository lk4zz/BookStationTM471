// sections/BookDescription/BookDescription.jsx
import styles from "./BookDescription.module.css";
import { formatBookData } from "../../../../utils/bookUtils";
import { useGetProgress } from "../../../../hooks/useProgress";
import { readingProgressSummary } from "../../../../utils/readingProgressPercent";

// Context
import { useBookDetailsContext } from "../../context/BookDetailsContext"; // Adjust path as needed

function BookDescription() {
  // 1. Consume book and chapter data from context instead of props and duplicate hooks
  const { book, chapters, isChapterLoading } = useBookDetailsContext();

  const formattedBook = formatBookData(book);
  if (!formattedBook) return null;

  const { description, bookId } = formattedBook;

  // We keep useGetProgress here because it relies on the formatted bookId 
  // and is highly specific to this component's UI
  const { progress, isProgressLoading } = useGetProgress(bookId);

  const summary = readingProgressSummary({ chapters }, progress);
  const { percent, ordinal, total, started } = summary;
  const progressLabelBusy = isProgressLoading || isChapterLoading;

  return (
    <div className={styles.container}>
      <p className={styles.descriptionText}>{description}</p>

      {total > 0 && (
        <div className={styles.progressContainer}>
          <div className={styles.progressHeader}>
            <h4 className={styles.progressTitle}>Reading progress</h4>
            <span className={styles.progressText}>
              {progressLabelBusy
                ? "…"
                : started
                  ? `Chapter ${ordinal} of ${total}`
                  : "Not started"}
            </span>
          </div>

          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressLabelBusy ? 0 : percent}%` }}
            />
          </div>
          <div className={styles.progressPercentage}>
            {progressLabelBusy ? "…" : `${percent}%`}
          </div>
        </div>
      )}
    </div>
  );
}

export default BookDescription;