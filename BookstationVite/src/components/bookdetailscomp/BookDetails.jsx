const BASE_URL = import.meta.env.VITE_API_URL || "";
import styles from "./BookDetails.module.css";
import { EyeIcon } from "../UI/IconLibrary";
import { Rating } from "react-simple-star-rating";

function BookDetails({ book }) {
  if (!book) return null;
  const {
    name = "Untitled",
    coverImage = "",
    ratingAverage = 0,
    views = 0,
    author,
  } = book;

  const coverUrl = coverImage
    ? `${BASE_URL}/${coverImage}`
    : "/fallback-cover.jpg";

  const bgStyle = {
    backgroundImage: `url(${coverUrl})`,
  };
  const authorName = author?.name || "Unknown";

  return (
    <section className={styles.container}>
      <div className={styles.bgImage} style={bgStyle} />
      <div className={styles.overlay} />

      <div className={styles.contentWrapper}>
        <div className={styles.bookdetails}>
          <h2 className={styles.bookTitle}>{name}</h2>
          <p>by {authorName}</p>    
          <div className={styles.bookinsights}>
            

            <div className={styles.statItem}>
              <Rating
                initialValue={ratingAverage}
                readonly={true}
                allowFraction={true}
                size={20}
                fillColor="#FFD700"
                emptyColor="#E0E0E0"
              />
              <span style={{ marginLeft: "5px" }}>
                {ratingAverage.toFixed(1)}
              </span>
            </div>

            <div className={styles.statItem}>
              <EyeIcon className={styles.iconEye} />
              {views} Veiws
            </div>
          </div>

          <div className={styles.buttons}>
            <button className={styles.primaryBtn}>Read</button>
            <button className={styles.secondaryBtn}>Add to Library</button>
          </div>
        </div>
        <div className={styles.bookcover}>
          <img
            src={coverUrl}
            alt={name}
            className={styles.cover}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

export default BookDetails;
