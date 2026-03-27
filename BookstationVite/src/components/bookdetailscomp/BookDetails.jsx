import styles from "./BookDetails.module.css";
import { EyeIcon } from "../UI/IconLibrary";
import { Rating } from "react-simple-star-rating";
import { formatBookData } from "../../utils/bookUtils";
import AddToLibraryBtn from "../UI/AddToLibraryBtn";

function BookDetails({ book, onBack, views }) {
  const formattedBook = formatBookData(book);
  if (!formattedBook) return null;
  const { name, bookId, coverUrl, ratingAverage, ratingCount, authorName } = formattedBook;
  console.log(bookId)
  
  return (
    <div className={styles.container}>
      <div
        className={styles.bgImage}
        style={{ backgroundImage: `url(${coverUrl})` }}
      />
      <div className={styles.overlay} />

      <div className={styles.contentWrapper}>
        <div className={styles.bookInfo}>
          <button className={styles.goBackBtn} onClick={onBack}>
            &larr; Go Back
          </button>

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
              <AddToLibraryBtn bookId={bookId}/>
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
