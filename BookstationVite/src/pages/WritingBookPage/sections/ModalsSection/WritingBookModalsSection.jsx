import EditBookModal from "../../../../GlobalComponents/Modals/EditBookModal/EditBookModal";
import LaunchModal from "./components/LaunchModal/LaunchModal";
import WarningModal from "../../../../GlobalComponents/Modals/WarningModal/WarningModal";

function WritingBookModalsSection({
  showEditBook,
  book,
  setError,
  setShowEditBook,
  showLaunch,
  chapters,
  handleLaunchBook,
  setShowLaunch,
  isLaunchPending,
  error,
  compWarning,
  setCompWarning,
  confirmCompletedStatus,
  isStatusPending,
}) {
  return (
    <>
      {showEditBook && (
        <EditBookModal
          book={book}
          onError={setError}
          onClose={() => setShowEditBook(false)}
        />
      )}

      {showLaunch && (
        <LaunchModal
          chapters={chapters}
          onLaunch={(prices) => {
            handleLaunchBook(prices);
            setShowLaunch(false);
          }}
          onClose={() => setShowLaunch(false)}
          isPending={isLaunchPending}
          error={error}
        />
      )}

      {compWarning && (
        <WarningModal
          heading="Mark book as completed?"
          message="Completed books cannot be edited again. Chapters, the editor, and book metadata will stay as they are now. This cannot be undone from the writing dashboard."
          onConfirm={confirmCompletedStatus}
          onClose={() => setCompWarning(false)}
          isPending={isStatusPending}
          confirmText="Mark completed"
          pendingText="Updating…"
        />
      )}
    </>
  );
}

export default WritingBookModalsSection;
