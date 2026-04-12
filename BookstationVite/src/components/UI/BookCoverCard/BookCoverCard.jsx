import styles from "./BookCoverCard.module.css";
import { Link } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_API_URL || "";
import { EyeIcon, StarIcon } from "../Icons/IconLibrary";
import { addView } from "../../../api/views";

function BookCoverCard({ book, totalViews }) {
  const coverSrc = book.coverImage?.startsWith("http")
    ? book.coverImage
    : `${BASE_URL}/${book.coverImage}`;

  return (
    <Link onClick={() => addView(book.id)} className={styles.link} to={`/book/${book.id}`}>
      <div className={styles.card}>
        <img src={coverSrc} alt={book.name} className={styles.cover} />

        <div className={styles.overlay}>
          <span className={styles.author}>{book.author?.name}</span>

          <div className={styles.stats}>
            <span className={styles.stat}>
              <EyeIcon className={styles.eye} />
              {totalViews ?? "—"}
            </span>
            <span className={styles.stat}>
              <StarIcon className={styles.star} />
              {book.ratingAverage || "0.0"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BookCoverCard;