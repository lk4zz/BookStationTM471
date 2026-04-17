import EditBookModal from "../../../../components/UI/EditBookModal/EditBookModal";
import LaunchModal from "./components/LaunchModal/LaunchModal";

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
    </>
  );
}

export default WritingBookModalsSection;
