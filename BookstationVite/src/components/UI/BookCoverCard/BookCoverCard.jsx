import styles from "./BookCoverCard.module.css";
import { Link, useLocation } from "react-router-dom";
import { linkStateFromHere } from "../../../utils/navigation";
const BASE_URL = import.meta.env.VITE_API_URL || "";
import { EyeIcon, StarIcon } from "../Icons/IconLibrary";
import { addView } from "../../../api/views";

function formatAvg(ratingAverage, book) {
  const v = ratingAverage ?? book?.ratingAverage;
  if (v == null || v === "") return "0.0";
  return typeof v === "number" ? v.toFixed(1) : String(v);
}

function BookCoverCard({ book, ratingAverage }) {
  const location = useLocation();
  const coverSrc = book.coverImage?.startsWith("http")
    ? book.coverImage
    : `${BASE_URL}/${book.coverImage}`;

  return (
    <Link
      onClick={() => addView(book.id)}
      className={styles.link}
      to={`/book/${book.id}`}
      state={linkStateFromHere(location)}
    >
      <article className={styles.card}>
        <img src={coverSrc} alt={book.name} className={styles.cover} />

        <div className={styles.overlay}>
          <div className={styles.header}>
            <h3 className={styles.title}>{book.name}</h3>
            <p className={styles.author}>{book.author?.name}</p>
          </div>

          <div className={styles.stats}>
            <span className={styles.stat}>
              <EyeIcon className={styles.eye} />
              {book._count?.views ?? "—"}
            </span>
            <span className={styles.stat}>
              <StarIcon className={styles.star} />
              {formatAvg(ratingAverage, book)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default BookCoverCard;