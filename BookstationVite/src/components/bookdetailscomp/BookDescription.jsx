import styles from "./BookDescription.module.css";
import { formatBookData } from "../../utils/bookUtils";
import { useGetProgress } from "../../hooks/useProgress";
import { useChaptersByBook } from "../../hooks/useChapters";

function BookDescription({ book }) {
  const formattedBook = formatBookData(book);
  if (!formattedBook) return null;

  const { description, bookId } = formattedBook;

  const { progress } = useGetProgress(bookId);
  const { chapters } = useChaptersByBook(bookId);
  let percentage = 0;
  let currentChapterNum = 0;
  const totalChapters = chapters?.length || 0;

  if (progress && chapters) {
    // Find the chapter number of their last read chapter
    const currentChapter = chapters.find(ch => ch.id === progress.lastChapterId);
    if (currentChapter) {
      currentChapterNum = currentChapter.chapterNum;
      percentage = Math.round((currentChapterNum / totalChapters) * 100);
    }
  }

return (
    <div className={styles.container}>
      <p className={styles.descriptionText}>{description}</p>

      {/* Only show progress UI if they have actually started reading or if chapters exist */}
      {totalChapters > 0 && (
        <div className={styles.progressContainer}>
          <div className={styles.progressHeader}>
            <h4 className={styles.progressTitle}>Reading Progress</h4>
            <span className={styles.progressText}>
              Chapter {currentChapterNum} of {totalChapters}
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
      )}
    </div>
  );
}


export default BookDescription;
