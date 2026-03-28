import BookChapters from "../bookdetailscomp/BookChapters";
import styles from "./ChaptersPanel.module.css";
import OnBackButton from "../UI/OnBackButton";
import { useNavigate } from "react-router-dom";


function ChaptersPanel({ chapter, chapters, isChapterLoading }) {
  const navigate = useNavigate()
  const handleOnClick = (chapter) => {
    if (chapter.hasAccess) {
      navigate(`/book/reading/${chapter.bookId}/${chapter.id}`);
    }
    else { alert("nigga you dont have access") }
  }
  return (
    <div className={styles.leftPanel}>

      <section className={styles.upperPanel}>
        <OnBackButton />
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
                <BookChapters 
                onClick={() => handleOnClick(chapter)}
                key={chapter.id} chapter={chapter} className={styles.cursorChapter} />
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
