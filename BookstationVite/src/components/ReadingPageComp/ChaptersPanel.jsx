import BookChapters from "../bookdetailscomp/BookChapters";
import styles from "../../pages/bookdetails/BookDetailsPage.module.css";


function ChaptersPanel({chapters, isChapterLoading}) {
  return (
    <div>
      <h3>Chapters Panel</h3>
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
    </div>
  );
}

export default ChaptersPanel;
