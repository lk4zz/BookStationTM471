import BookChapters from "../bookdetailscomp/BookChapters";
import styles from "./ChaptersPanel.module.css";
import OnBackButton from "../UI/OnBackButton";


function ChaptersPanel({ chapter, chapters, isChapterLoading }) {
  return (
    <div className={styles.leftPanel}>

      <section className={styles.upperPanel}>
        <OnBackButton/>
        <h3>{chapter.book.name}</h3>
      </section>

      {/* might need to combine all of this to a full ready component */}
      <section className={styles.chapterList}>
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
      </section>

    </div>
  );
}

export default ChaptersPanel;
