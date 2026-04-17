import OnBackButton from "../../../../../../components/UI/Buttons/OnBackButtons";
import WritingChaptersPanel from "../WritingChaptersPanel/WritingChaptersPanel";
import styles from "./WritingPageSidePanel.module.css";

const POST_LAUNCH_OPTIONS = ["ONGOING", "COMPLETED"];

function WritingPageSidePanel({
  book,
  onStatusChange,
  isStatusPending,
  onLaunchBook,
  isBusy,
  numericBookId,
  chapters,
  selectedChapterId,
  selectChapter,
  onCreateChapter,
  onUpdateChapter,
  handleDeleteChapter,
  onPublishChapter,
  bookStatus,
  error,
  navigate,
}) {
  const isDraft = book.status === "DRAFT";

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <OnBackButton onClick={() => navigate("/writing")} />

        <div className={styles.headerRight}>
          {isDraft ? (
            <>
              <span className={styles.statusBadge}>Draft</span>
              <button
                type="button"
                className={styles.launchBtn}
                onClick={onLaunchBook}
                disabled={isBusy}
              >
                Launch
              </button>
            </>
          ) : (
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
          )}
        </div>
      </div>

      {error && <p className={styles.statusErr}>{error}</p>}

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
          bookStatus={bookStatus}
          isBusy={isBusy}
        />
      </div>
    </aside>
  );
}

export default WritingPageSidePanel;
