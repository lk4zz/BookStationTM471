import React from "react";
import styles from "./TopPicks.module.css";
import { StarIcon, EyeIcon } from "../UI/IconLibrary";
import { formatBookData } from "../../utils/bookUtils";
const BASE_URL = import.meta.env.VITE_API_URL || "";

function TopPicks({ book }) {
  const formattedBook  = formatBookData(book);
  if (!formattedBook) return null;

  const { name, coverUrl, ratingAverage, authorName } = formattedBook;

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
              <StarIcon className={styles.iconStar}/>
              {ratingAverage.toFixed(1)}
            </div>

            <div className={styles.statItem}>
              <EyeIcon className={styles.iconEye} />
              {views}
            </div>
          </div>

          {description && <p className={styles.description}>{description}</p>}

          <div className={styles.buttons}>
            <button className={styles.primaryBtn}>Continue Reading</button>
            <button className={styles.secondaryBtn}>Add to Library</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TopPicks;
