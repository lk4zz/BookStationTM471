import styles from "./BookDetails.module.css";
import { EyeIcon } from "../UI/IconLibrary";
import { Rating } from "react-simple-star-rating";

const BASE_URL = import.meta.env.VITE_API_URL || "";

function BookDetails({ book, onBack, views }) {

  if (!book) return null; 
  const { name = "Untitled", coverImage = "", ratingAverage = 0, ratingCount = 0, author } = book;
  
  const coverUrl = coverImage ? `${BASE_URL}/${coverImage}` : "/fallback-cover.jpg";
  const authorName = author?.name || "Unknown";

  return (
    <div className={styles.container}>
      <div className={styles.bgImage} style={{ backgroundImage: `url(${coverUrl})` }} />
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
              <Rating initialValue={ratingAverage} readonly allowFraction size={18} fillColor="#eab308" emptyColor="#3f3f46" />
              <span>({ratingCount} votes)</span>
            </div>
            <div className={styles.statItem}>
              <EyeIcon className={styles.iconEye} />
              <span>{views} Views</span>
            </div>
          </div>

          <div className={styles.buttons}>
            <button className={styles.primaryBtn}>Continue Reading (68%)</button>
            <button className={styles.secondaryBtn}>Add to Library</button>
          </div>
        </div>

        <div className={styles.coverWrapper}>
          <img src={coverUrl} alt={name} className={styles.cover} loading="lazy" />
        </div>
      </div>
    </div>
  );
}

export default BookDetails;