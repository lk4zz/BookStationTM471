import { useState } from "react";
import { Link } from "react-router-dom";
import OnBackButton from "../../UI/Buttons/OnBackButtons";
import WritingChaptersPanel from "../WritingChaptersPanel/WritingChaptersPanel";
import LaunchModal from "../LaunchModal/LaunchModal";
import styles from "./WritingPageSidePanel.module.css";

const POST_LAUNCH_OPTIONS = ["ONGOING", "COMPLETED"];

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
  onLaunchBook,
  isLaunchPending,
  isBusy,
  error,
}) {
  const [showLaunch, setShowLaunch] = useState(false);
  const isDraft = book.status === "DRAFT";

  return (
    <aside className={styles.panel}>
      <div className={styles.metaCard}>
        <Link to="/writing" className={styles.back}>
          <OnBackButton />
        </Link>
        <h1 className={styles.bookTitle}>{book.name}</h1>

        {isDraft ? (
          <>
            <span className={styles.statusBadge}>Draft</span>
            <button
              type="button"
              className={styles.launchBtn}
              onClick={() => setShowLaunch(true)}
              disabled={isBusy}
            >
              Launch Book
            </button>
          </>
        ) : (
          <label className={styles.statusLabel}>
            Book status
            <select
              className={styles.statusSelect}
              value={book.status}
              onChange={onStatusChange}
              disabled={isStatusPending}
            >
              {POST_LAUNCH_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </label>
        )}

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
          bookStatus={book.status}
          isBusy={isBusy}
        />
      </div>

      {showLaunch && (
        <LaunchModal
          chapters={chapters}
          onLaunch={(prices) => {
            onLaunchBook(prices);
            setShowLaunch(false);
          }}
          onClose={() => setShowLaunch(false)}
          isPending={isLaunchPending}
          error={error}
        />
      )}
    </aside>
  );
}

export default WritingPageSidePanel;
