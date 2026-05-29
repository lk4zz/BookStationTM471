import { useState } from "react";
import DraftBookCard from "./Components/DashBookCards/DashBookCards";
import styles from "../../WritingDashboardPage.module.css";
import Loading from "../../../../GlobalComponents/Feedback/Loading/Loading";
import WarningModal from "../../../../GlobalComponents/Modals/WarningModal/WarningModal";
import { useSubmitForReview } from "../../../../hooks/bookHooks/useBookMutations";



function DashboardBooksSection({ isLoading, error, onDelete,
  booksByAuthor, isBooksByAuthorLoading, booksByAuthorError, activeTab }) {
  const { mutate: submitForReview, isPending: isSubmittingForReview } = useSubmitForReview();
  const [reviewBookId, setReviewBookId] = useState(null);
  const [reviewNote, setReviewNote] = useState("");
  const [bookToDelete, setBookToDelete] = useState(null);

  const handleOpenReviewModal = (bookId) => {
    setReviewBookId(bookId);
    setReviewNote("");
  };

  const handleCloseReviewModal = () => {
    setReviewBookId(null);
  };

  const handleOpenDeleteModal = (book) => {
    setBookToDelete(book);
  };

  const handleConfirmSubmitForReview = () => {
    if (!reviewBookId) return;
    submitForReview(
      { bookId: reviewBookId, submissionNote: reviewNote },
      { onSuccess: () => setReviewBookId(null) }
    );
  };



  if (isBooksByAuthorLoading || isLoading) return <Loading />
  if (booksByAuthorError || error) booksByAuthor = [];

  // Flagged books are isolated to their own tab only
  const draftBooks = booksByAuthor?.filter((book) => book.status === "DRAFT" && !book.isFlagged);
  const onGoingBooks = booksByAuthor?.filter((book) => book.status === "ONGOING" && !book.isFlagged);
  const completedBooks = booksByAuthor?.filter((book) => book.status === "COMPLETED" && !book.isFlagged);
  const flaggedBooks = booksByAuthor?.filter((book) => book.isFlagged);

  let booksToShow = draftBooks;
  if (activeTab === "COMPLETED") {
    booksToShow = completedBooks;
  } else if (activeTab === "ONGOING") {
    booksToShow = onGoingBooks;
  } else if (activeTab === "FLAGGED") {
    booksToShow = flaggedBooks;
  }

  if (booksToShow?.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No books yet.</p>
      </div>
    );
  }

  return (
    <>
      <ul className={styles.booksGrid}>
        {booksToShow?.map((book) => (
          <div key={book.id}>
            <DraftBookCard
              book={book}
              onDelete={onDelete}
              activeTab={activeTab}
              onOpenReviewModal={handleOpenReviewModal}
              onOpenDeleteModal={handleOpenDeleteModal}
            />
          </div>
        ))}
      </ul>

      {reviewBookId && (
        <WarningModal
          heading="Submit Fixes for Review"
          message="Describe what you changed so admins can review your fixes:"
          confirmText="Submit"
          pendingText="Submitting..."
          isPending={isSubmittingForReview}
          onConfirm={handleConfirmSubmitForReview}
          onClose={handleCloseReviewModal}
          textField={true}
          inputValue={reviewNote}
          onInputChange={setReviewNote}
          inputPlaceholder="I updated chapter 3 to remove..."
        />
      )}

      {bookToDelete && (
        <WarningModal
          heading="Delete Book Permanently?"
          message={`Delete "${bookToDelete.name ?? "this book"}" permanently? This cannot be undone.`}
          onConfirm={() => {
            onDelete(bookToDelete.id);
            setBookToDelete(null);
          }}
          onClose={() => setBookToDelete(null)}
          isPending={onDelete.isPending}
          confirmText="Delete Book"
          pendingText="Deleting…"
        />
      )}

    </>
  );
}

export default DashboardBooksSection;
