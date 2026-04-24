import EditBookModal from "../../../../components/UI/EditBookModal/EditBookModal";
import LaunchModal from "./components/LaunchModal/LaunchModal";
import CompletedWarningModal from "./components/CompletedWarningModal/CompletedWarningModal";

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
        <CompletedWarningModal
          onConfirm={confirmCompletedStatus}
          onClose={() => setCompWarning(false)}
          isPending={isStatusPending}
        />
      )}
    </>
  );
}

export default WritingBookModalsSection;
