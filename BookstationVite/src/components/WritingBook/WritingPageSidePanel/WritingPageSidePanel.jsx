import { Link } from "react-router-dom";
import OnBackButton from "../../UI/Buttons/OnBackButtons";
import WritingChaptersPanel from "../WritingChaptersPanel/WritingChaptersPanel";
import styles from "./WritingPageSidePanel.module.css";

const STATUS_OPTIONS = ["DRAFT", "ONGOING", "COMPLETED"];

function WritingPageSidePanel({
  book,
  onStatusChange,
  isStatusPending,
  numericBookId,
  chapters,
  selectedChapterId,
  selectChapter,
  onCreateChapter,
  onUpdateChapter,
  handleDeleteChapter,
  onPublishChapter,
  isBusy,
  error,
}) {
  return (
    <aside className={styles.panel}>
      <div className={styles.metaCard}>
        <Link to="/writing" className={styles.back}>
          <OnBackButton />
        </Link>
        <h1 className={styles.bookTitle}>{book.name}</h1>
        <label className={styles.statusLabel}>
          Book status
          <select
            className={styles.statusSelect}
            value={book.status}
            onChange={onStatusChange}
            disabled={isStatusPending}
          > 
          
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}
              disabled={status === "DRAFT"}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </label>
        {error && <p className={styles.statusErr}>{error}</p>}
      </div>




      <div className={styles.chaptersWrap}>
        <WritingChaptersPanel
          bookId={numericBookId}
          chapters={chapters}
          selectedChapterId={selectedChapterId}
          onSelectChapter={selectChapter}
          onCreateChapter={onCreateChapter}
          onUpdateChapter={onUpdateChapter}
          onDeleteChapter={handleDeleteChapter}
          onPublishChapter={onPublishChapter}
          isBusy={isBusy}
        />
      </div>
    </aside>
  );
}

export default WritingPageSidePanel;
