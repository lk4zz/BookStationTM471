// sections/BookDetails/BookDetails.jsx
import { useLocation } from "react-router-dom";
import styles from "./BookDetails.module.css";
import { formatBookData } from "../../../../utils/bookUtils";
import { linkStateFromHere } from "../../../../utils/navigation";

// Context
import { useBookDetailsContext } from "../../context/BookDetailsContext"; // Adjust path based on your folder structure

// Components
import BookDetailsHeader from "./components/BookDetailsHeader/BookDetailsHeader";
import BookDetailsStats from "./components/BookDetailsStats/BookDetailsStats";
import ContinueReadingBtn from "../../../../GlobalComponents/Buttons/ContinueReadingBtn";
import AddToLibraryBtn from "../../../../GlobalComponents/Buttons/AddToLibraryBtn";
import BookReportModal from "./components/BookReportModal/BookReportModal";

function BookDetails() {
  const location = useLocation();
  
  // 1. Consume the context instead of taking props!
  const {
    book,
    ratingModal,
    OpenRatinModal,
    closeRatinModal,
    ratingAverage,
    ratingCount,
    reportModal,
    handleReportBtn,
    closeReportModal,
    createReportMutation,
    isBookInLibrary,
    handleReportComment,
    handleReportReason,
    handleSubmitReport,
    currentUser,
  } = useBookDetailsContext();

  const formattedBook = formatBookData(book);
  if (!formattedBook) return null;

  const { name, bookId, coverUrl, authorName, userId } = formattedBook;
  const readState = linkStateFromHere(location);

  return (
    <div className={styles.container}>
      {/* Background Hero Elements */}
      <div
        className={styles.bgImage}
        style={{ backgroundImage: `url(${coverUrl})` }}
      />
      <div className={styles.overlay} />

      {/* Main Content Layout */}
      <div className={styles.contentWrapper}>
        <div className={styles.bookInfo}>
          <BookDetailsHeader
            name={name}
            authorName={authorName}
            userId={userId}
            readState={readState}
          />

          <BookDetailsStats
            bookId={bookId}
            views={book?._count?.views}
            ratingAverage={ratingAverage}
            ratingCount={ratingCount}
            ratingModal={ratingModal}
            OpenRatinModal={OpenRatinModal}
            closeRatinModal={closeRatinModal}
          />

          <div className={styles.buttons}>
            <ContinueReadingBtn bookId={bookId} readState={readState} />
            <AddToLibraryBtn bookId={bookId} isBookInLibrary={isBookInLibrary} currentUser={currentUser} />
            <button className={styles.reportBtn} onClick={handleReportBtn}>
              Report Book
            </button>
          </div>
        </div>

        {/* Cover Art */}
        <div className={styles.coverWrapper}>
          <img
            src={coverUrl}
            alt={name}
            className={styles.cover}
            loading="lazy"
          />
        </div>
      </div>

      <BookReportModal
        isOpen={reportModal}
        onClose={closeReportModal}
        bookId={bookId}
        createReportMutation={createReportMutation}
        handleReportComment={handleReportComment}
        handleReportReason={handleReportReason}
        handleSubmitReport={handleSubmitReport}
      />
    </div>
  );
}

export default BookDetails;