import { useWritingBookPageData } from "../../hooks/features/useWritingBook";
import { useParams } from "react-router-dom";
import { checkIfGuest } from "../../utils/checkIfGuest";
import { Link } from "react-router-dom";
import styles from "./WritingBookPage.module.css";
import WritingCanvas from "../../components/WritingBook/WritingCanvas/WritingCanvas";
import WritingAiPanel from "../../components/WritingBook/WritingAiPanel/WritingAiPanel";
import WritingToolbar from "../../components/WritingBook/WritingToolBar/WritingToolbar";
import WritingPageSidePanel from "../../components/WritingBook/WritingPageSidePanel/WritingPageSidePanel";
import { useWritingCanvas } from "../../hooks/features/useWritingCanvas";

function WritingBookPage() {
  const { bookId } = useParams();
  const numericBookId = Number(bookId);
  if (checkIfGuest()) return null;
  const { book, bookLoading, bookError, chapters, chaptersLoading, pagesLoading, selectedChapterId,
    selectChapter, initialHtml, isBusy, handleStatusChange, handleDeleteChapter,
    onCreateChapter, onUpdateChapter, onPublishChapter, isStatusPending, error } = useWritingBookPageData(numericBookId);
  const isLoading = chaptersLoading || pagesLoading;
  const { editor, words, approxPages, saveStatus } = useWritingCanvas({
    chapterId: selectedChapterId,
    bookId: numericBookId,
    initialHtml,
    isLoading,
  });
  
  if (bookLoading) {
    return <div className={styles.page}><p className={styles.centerMsg}>Loading book...</p></div>;
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
    <div className={styles.writingPageViewport}>
      <div className={styles.writingPage}>
        <section className={styles.chaptersPanelContainer}>
          <WritingPageSidePanel
          book={book}
          onStatusChange={handleStatusChange}
          isStatusPending={isStatusPending}
          numericBookId={numericBookId}
          chapters={chapters}
          selectedChapterId={selectedChapterId}
          selectChapter={selectChapter}
          onCreateChapter={onCreateChapter}
          onUpdateChapter={onUpdateChapter}
          handleDeleteChapter={handleDeleteChapter}
          onPublishChapter={onPublishChapter}
          isBusy={isBusy}
          error={error}
          />
        </section>
        <section className={styles.middleSection}>
          <div className={styles.aboveCanvas}>
            <WritingToolbar editor={editor} />
          </div>
          <div className={styles.canvasContainer}>
            <WritingCanvas
              editor={editor}
              words={words}
              approxPages={approxPages}
              saveStatus={saveStatus}
              chapterId={selectedChapterId}
            />
          </div>
        </section>
        <section className={styles.AiPanelContainer}>
          <WritingAiPanel chapterId={selectedChapterId} />
        </section>
      </div>
    </div>
  );
}

export default WritingBookPage;