import styles from "./BookDetails.module.css";
import { EyeIcon } from "../UI/IconLibrary";
import { Rating } from "react-simple-star-rating";
import { formatBookData } from "../../utils/bookUtils";
import AddToLibraryBtn from "../UI/AddToLibraryBtn";
import { useLibraryBooks } from "../../hooks/useLibrary";
import OnBackButton from "../UI/OnBackButton";

function BookDetails({ book, views }) {
  const formattedBook = formatBookData(book);
  if (!formattedBook) return null;
  const { name, bookId, coverUrl, ratingAverage, ratingCount, authorName } =
    formattedBook;
  const { data: libraryBooks } = useLibraryBooks();
  const isBookInLibrary = libraryBooks?.some((book) => book.bookId === bookId);
  console.log(bookId);

  return (
    <div className={styles.container}>
      <div
        className={styles.bgImage}
        style={{ backgroundImage: `url(${coverUrl})` }}
      />
      <div className={styles.overlay} />

      <div className={styles.contentWrapper}>
        <div className={styles.bookInfo}>

          <OnBackButton />

          <h2 className={styles.bookTitle}>{name}</h2>
          <p className={styles.authorText}>by {authorName}</p>

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
            <button className={styles.primaryBtn}>
              Continue Reading (68%)
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
