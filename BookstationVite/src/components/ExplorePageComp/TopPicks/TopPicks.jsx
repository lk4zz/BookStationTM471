import React from "react";
import styles from "./TopPicks.module.css";
import { StarIcon, EyeIcon } from "../../UI/Icons/IconLibrary";
import { formatBookData } from "../../../utils/bookUtils";
import { useViews } from "../../../hooks/useViews";
import AddToLibraryBtn from "../../UI/Buttons/AddToLibraryBtn";
import { useLibraryBooks } from "../../../hooks/useLibrary";

function TopPicks({ book }) {
  const formattedBook = formatBookData(book);
  if (!formattedBook) return null;
  const { name, bookId, coverUrl, description, ratingAverage, authorName } = formattedBook;
  const { data: libraryBooks } = useLibraryBooks();
  const isBookInLibrary = libraryBooks?.some((book) => book.bookId === bookId);
  const { totalViews } = useViews(bookId);
  const bgStyle = {
    backgroundImage: `url(${coverUrl})`,
  };

  return (
    <section className={styles.container}>
      <div className={styles.bgImage} style={bgStyle} />
      <div className={styles.overlay} />
      <div className={styles.contentWrapper}>
        <div className={styles.bookcover}>
          <img
            src={coverUrl}
            alt={name}
            className={styles.cover}
            loading="lazy"
          />
        </div>

        <div className={styles.bookdetails}>
          <span className={styles.title}>Top Pick</span>
          <h2 className={styles.bookTitle}>{name}</h2>

          <div className={styles.bookinsights}>
            <p>by {authorName}</p>

            <div className={styles.statItem}>
              <StarIcon className={styles.iconStar} />
              {ratingAverage.toFixed(1)}
            </div>

            <div className={styles.statItem}>
              <EyeIcon className={styles.iconEye} />
              {totalViews}
            </div>
          </div>

          {description && <p className={styles.description}>{description}</p>}

          <div className={styles.buttons}>
            <button className={styles.primaryBtn}>Continue Reading</button>
            <AddToLibraryBtn bookId={bookId} isBookInLibrary={isBookInLibrary} className={styles.secondaryBtn} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default TopPicks;
