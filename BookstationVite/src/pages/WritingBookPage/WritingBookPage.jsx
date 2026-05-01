import { useParams, useNavigate, Link } from "react-router-dom";
import { checkIfGuest } from "../../utils/checkIfGuest";
import styles from "./WritingBookPage.module.css";
import WritingBookSidePanelSection from "./sections/SidePanel/WritingBookSidePanelSection";
import WritingBookEditorSection from "./sections/EditorCanvas/WritingBookEditorSection";
import WritingBookAiPanelSection from "./sections/AIPanel/WritingBookAiPanelSection";
import WritingBookModalsSection from "./sections/ModalsSection/WritingBookModalsSection";
import { useWritingBookPage } from "./features/useWritingBookPage";

function WritingBookPage() {
  const { bookId } = useParams();
  const numericBookId = Number(bookId);
  const navigate = useNavigate();

  if (checkIfGuest()) return null;

  const {
    book,
    bookLoading,
    bookError,
    chapters,
    selectedChapterId,
    selectChapter,
    isBusy,
    cannotEdit,
    handleStatusChange,
    handleDeleteChapter,
    onCreateChapter,
    onUpdateChapter,
    onPublishChapter,
    handleLaunchBook,
    isStatusPending,
    isLaunchPending,
    error,
    setError,
    editor,
    words,
    approxPages,
    saveStatus,
    showEditBook,
    setShowEditBook,
    showLaunch,
    setShowLaunch,
    compWarning,
    setCompWarning,
    confirmCompletedStatus,
    currentUser,
  } = useWritingBookPage(numericBookId);

  // --- Inline Loading State ---
  if (bookLoading) {
    return (
      <div className={styles.fullScreenState}>
        <p className={styles.centerMsg}>Loading book...</p>
      </div>
    );
  }

  // --- Inline Error State ---
  if (bookError || !book) {
    return (
      <div className={styles.fullScreenState}>
        <p className={styles.centerMsg}>
          {bookError?.message ?? "Book not found."}{" "}
          <Link to="/writing" className={styles.backLink}>
            Back to writing
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.writingPageViewport}>
      <div className={styles.writingPage}>
        <WritingBookSidePanelSection
          book={book}
          onStatusChange={handleStatusChange}
          isStatusPending={isStatusPending}
          onLaunchBook={() => setShowLaunch(true)}
          isBusy={isBusy}
          numericBookId={numericBookId}
          chapters={chapters}
          selectedChapterId={selectedChapterId}
          selectChapter={selectChapter}
          onCreateChapter={onCreateChapter}
          onUpdateChapter={onUpdateChapter}
          handleDeleteChapter={handleDeleteChapter}
          onPublishChapter={onPublishChapter}
          bookStatus={book.status}
          error={error}
          navigate={navigate}
          compWarning={compWarning}
        />

        <WritingBookEditorSection
          editor={editor}
          onEditBook={() => setShowEditBook(true)}
          words={words}
          approxPages={approxPages}
          saveStatus={saveStatus}
          chapterId={selectedChapterId}
          cannotEdit={cannotEdit}
        />

        <WritingBookAiPanelSection 
        currentUser={currentUser}
        chapterId={selectedChapterId} />
      </div>

      <WritingBookModalsSection
        showEditBook={showEditBook}
        book={book}
        setError={setError}
        setShowEditBook={setShowEditBook}
        showLaunch={showLaunch}
        chapters={chapters}
        handleLaunchBook={handleLaunchBook}
        setShowLaunch={setShowLaunch}
        isLaunchPending={isLaunchPending}
        error={error}
        compWarning={compWarning}
        setCompWarning={setCompWarning}
        confirmCompletedStatus={confirmCompletedStatus}
        isStatusPending={isStatusPending}
      />
    </div>
  );
}

export default WritingBookPage;