import styles from "./BookDescription.module.css";
import { formatBookData } from "../../utils/bookUtils";

function BookDescription({ book }) {
  const formattedBook = formatBookData(book);
  if (!formattedBook) return null;

  const { description } =
    formattedBook;
  // mocking progress for visual matching
  const current = 154;
  const total = 226;
  const percentage = Math.round((current / total) * 100);

  return (
    <div className={styles.container}>
      <p className={styles.descriptionText}>{description}</p>

      <div className={styles.progressContainer}>
        <div className={styles.progressHeader}>
          <h4 className={styles.progressTitle}>Book Progress</h4>
          <span className={styles.progressText}>
            Current Page: {current}/{total}
          </span>
        </div>

        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className={styles.progressPercentage}>{percentage}%</div>
      </div>
    </div>
  );
}

export default BookDescription;
