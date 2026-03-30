import { useWritingBookPageData } from "../../hooks/features/useWritingBook";
import { useParams } from "react-router-dom";
import { checkIfGuest } from "../../utils/checkIfGuest";
import styles from "./WritingBookPage.module.css";
import Toolbar from "../../components/WritingBook/WritingToolBar/ToolBar";
import WritingChaptersPanel from "../../components/WritingBook/WritingChaptersPanel/WritingChaptersPanel";
import WritingCanvas from "../../components/WritingBook/WritingCanvas/WritingCanvas";
import WritingAiPanel from "../../components/WritingBook/WritingAiPanel/WritingAiPanel";
import { Link } from "react-router-dom";


function WritingBookPage() {
  const { bookId } = useParams();
  const numericBookId = Number(bookId);

  if (checkIfGuest()) return null;

  const {
    book, bookLoading, bookError,
    chapters, chaptersLoading, pagesLoading,
    selectedChapterId, selectChapter,
    initialHtml,
    statusError,
    isBusy,
    handleStatusChange,
    handleDeleteChapter,
    onCreateChapter,
    onUpdateChapter,
    onPublishChapter,
    isStatusPending,
  } = useWritingBookPageData(numericBookId);

  if (bookLoading) {
    return (
      <div className={styles.page}>
        <p className={styles.centerMsg}>Loading book…</p>
      </div>
    );
  }

  if (bookError || !book) {
    return (
      <div className={styles.page}>
        <p className={styles.centerMsg}>
          {bookError?.message ?? "Book not found."}{" "}
          <Link to="/writing" className={styles.backLink}>Back to writing</Link>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Toolbar
        book={book}
        statusError={statusError}
        onStatusChange={handleStatusChange}
        isStatusPending={isStatusPending}
      />

      <div className={styles.layout}>
        <section className={styles.side}>
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
        </section>

        <section className={styles.main}>
          <WritingCanvas
            chapterId={selectedChapterId}
            bookId={numericBookId}
            initialHtml={initialHtml}
            isLoading={chaptersLoading || pagesLoading}
          />
        </section>

        <section className={styles.ai}>
          <WritingAiPanel />
        </section>
      </div>
    </div>
  );
}

export default WritingBookPage;