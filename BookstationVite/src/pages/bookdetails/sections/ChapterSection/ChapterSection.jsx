// sections/ChapterSection/ChapterSection.jsx
import styles from "./ChapterSection.module.css";
import ChapterCards from "../../../../GlobalComponents/Books/ChapterCards/ChapterCards";
import Loading from "../../../../GlobalComponents/Feedback/Loading/Loading";

// Context
import { useBookDetailsContext } from "../../context/BookDetailsContext"; // Adjust path as needed

function ChapterSection() {
  // 1. Consume the context instead of props
  const { chapters, isChapterLoading, publishedChapters } = useBookDetailsContext();

  return (
    <div className={styles.chaptercolumn}>
      <h3 className={styles.sectionTitle}>Chapters</h3>
      <div className={styles.scrollList}>
        {isChapterLoading ? (
          <Loading />
        ) : chapters?.length > 0 && publishedChapters?.length > 0 ? (
          chapters.map((chapter) => (
            <ChapterCards 
              key={chapter.id} 
              chapter={chapter} 
              className={styles.chapterCard}
            />
          ))
        ) : (
          <p className={styles.emptyState}>No chapters available.</p>
        )}
      </div>
    </div>
  );
}

export default ChapterSection;