import { useLocation } from "react-router-dom";
import styles from "./BookDetails.module.css";
import { formatBookData } from "../../../../utils/bookUtils";
import { linkStateFromHere } from "../../../../utils/navigation";
import { useLibraryBooks } from "../../../../hooks/useLibrary";

// Components
import BookDetailsHeader from "./components/BookDetailsHeader/BookDetailsHeader";
import BookDetailsStats from "./components/BookDetailsStats/BookDetailsStats";
import ContinueReadingBtn from "../../../../components/UI/Buttons/ContinueReadingBtn";
import AddToLibraryBtn from "../../../../components/UI/Buttons/AddToLibraryBtn";

function BookDetails({
  book,
  ratingModal,
  OpenRatinModal,
  closeRatinModal,
  ratingAverage,
  ratingCount,
}) {
  const location = useLocation();

  const formattedBook = formatBookData(book);
  if (!formattedBook) return null;

  const { name, bookId, coverUrl, authorName, userId } = formattedBook;
  const { data: libraryBooks } = useLibraryBooks();
  const isBookInLibrary = libraryBooks?.some((b) => b.bookId === bookId);
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
            <ContinueReadingBtn 
              bookId={bookId} 
              readState={readState} 
            />
            <AddToLibraryBtn 
              bookId={bookId} 
              isBookInLibrary={isBookInLibrary} 
            />
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
    </div>
  );
}

export default BookDetails;