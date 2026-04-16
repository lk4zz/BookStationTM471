import styles from "./BookDetails.module.css";
import { EyeIcon } from "../../../../components/UI/Icons/IconLibrary";
import { Rating } from "react-simple-star-rating";
import { formatBookData } from "../../../../utils/bookUtils";
import AddToLibraryBtn from "../../../../components/UI/Buttons/AddToLibraryBtn";
import { useLibraryBooks } from "../../../../hooks/useLibrary";
import OnBackButton from "../../../../components/UI/Buttons/OnBackButtons";
import { useNavigate, useLocation } from "react-router-dom";
import { linkStateFromHere } from "../../../../utils/navigation";
import { useGetProgress } from "../../../../hooks/useProgress";
import { useChaptersByBook } from "../../../../hooks/useChapters";

function BookDetails({ book, views }) {
  const navigate = useNavigate();
  const location = useLocation();

  const formattedBook = formatBookData(book);
  if (!formattedBook) return null;
  const { name, bookId, coverUrl, ratingAverage, ratingCount, authorName, userId } =
    formattedBook;
  const { data: libraryBooks } = useLibraryBooks();
  const isBookInLibrary = libraryBooks?.some((book) => book.bookId === bookId);

  const { progress, isProgressLoading } = useGetProgress(bookId);
  const { chapters, isChaptersLoading } = useChaptersByBook(bookId);

  const readState = linkStateFromHere(location);

  const handleReadClick = () => {
    if (progress?.lastChapterId) {
      navigate(`/book/reading/${bookId}/${progress.lastChapterId}`, { state: readState });
    } else if (chapters && chapters.length > 0) {
      navigate(`/book/reading/${bookId}/${chapters[0].id}`, { state: readState });
    }
  };
  const isDataLoading = isProgressLoading || isChaptersLoading;

  return (
    <div className={styles.container}>
      <div
        className={styles.bgImage}
        style={{ backgroundImage: `url(${coverUrl})` }}
      />
      <div className={styles.overlay} />

      <div className={styles.contentWrapper}>
        <div className={styles.bookInfo}>
          <div className={styles.backRow}>
            <OnBackButton onClick={() => navigate(-1)} className={styles.backOnHero} />
          </div>

          <h2 className={styles.bookTitle}>{name}</h2>
          <p
            onClick={() => navigate(`/author/${userId}`, { state: readState })}
            className={styles.authorText}
          >
            by {authorName}
          </p>

          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <Rating
                initialValue={ratingAverage}
                readonly
                allowFraction
                size={18}
                fillColor="#eab308"
                emptyColor="#3f3f46"
              />
              <span>({ratingCount} votes)</span>
            </div>
            <div className={styles.statItem}>
              <EyeIcon className={styles.iconEye} />
              <span>{views} Views</span>
            </div>
          </div>

          <div className={styles.buttons}>
            <button
              className={styles.primaryBtn}
              onClick={handleReadClick}
              disabled={isDataLoading }
            >
              {isDataLoading ? "Loading..." :
                progress ? "Continue Reading" : "Read First Chapter"}
            </button>
            <AddToLibraryBtn bookId={bookId} isBookInLibrary={isBookInLibrary} />
          </div>
        </div>

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
