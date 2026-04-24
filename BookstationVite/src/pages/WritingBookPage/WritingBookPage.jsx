import { useParams } from "react-router-dom";
import { checkIfGuest } from "../../utils/checkIfGuest";
import styles from "./WritingBookPage.module.css";
import WritingBookLoadingSection from "./sections/WritingBookLoadingSection/WritingBookLoadingSection";
import WritingBookErrorSection from "./sections/WritingBookErrorSection/WritingBookErrorSection";
import WritingBookSidePanelSection from "./sections/WritingBookSidePanelSection/WritingBookSidePanelSection";
import WritingBookEditorSection from "./sections/WritingBookEditorSection/WritingBookEditorSection";
import WritingBookAiPanelSection from "./sections/WritingBookAiPanelSection/WritingBookAiPanelSection";
import WritingBookModalsSection from "./sections/WritingBookModalsSection/WritingBookModalsSection";
import { useWritingBookPage } from "./features/useWritingBookPage";
import { useNavigate } from "react-router-dom";

function WritingBookPage() {
  const { bookId } = useParams();
  const numericBookId = Number(bookId);
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
  } = useWritingBookPage(numericBookId);
  const navigate = useNavigate();

  if (bookLoading) {
    return <WritingBookLoadingSection />;
  }
  if (bookError || !book) {
    return (
      <WritingBookErrorSection
        message={bookError?.message ?? "Book not found."}
      />
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

        <WritingBookAiPanelSection chapterId={selectedChapterId} />
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
