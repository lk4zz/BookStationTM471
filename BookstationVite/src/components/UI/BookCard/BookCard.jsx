import styles from "./BookCard.module.css";
import { Link, useLocation } from "react-router-dom";
import { linkStateFromHere } from "../../../utils/navigation";
import { readingProgressPercent } from "../../../utils/readingProgressPercent";
import { LibraryRemoveTrashIcon } from "../Icons/IconLibrary";
import { addView } from "../../../api/views";

const BASE_URL = import.meta.env.VITE_API_URL || "";

function BookCard({ book, progress = null, onRemoveFromLibrary, isRemoving }) {
  const location = useLocation();
  const coverSrc = book.coverImage?.startsWith("http")
    ? book.coverImage
    : `${BASE_URL}/${book.coverImage}`;

  const percent = readingProgressPercent(book, progress);
  const showRemove = typeof onRemoveFromLibrary === "function";

  return (
    <div className={styles.cardWrap}>
      <Link
        className={styles.link}
        to={`/book/${book.id}`}
        state={linkStateFromHere(location)}
        onClick={() => addView(book.id)}
      >
        <div className={styles.card}>
          <div className={styles.imageContainer}>
            <img src={coverSrc} alt={book.name} className={styles.cover} />
          </div>

          <div className={styles.details}>
            <h3 className={styles.title}>{book.name}</h3>
            <p className={styles.author}>{book.author?.name}</p>
          </div>

          <div className={styles.progressBlock}>
            <div className={styles.progressMeta}>
              <span className={styles.progressLabel}>Progress</span>
              <span className={styles.progressPct}>{percent}%</span>
            </div>
            <div className={styles.progressTrack} aria-hidden>
              <div className={styles.progressFill} style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>
      </Link>

      {showRemove && (
        <button
          type="button"
          className={styles.removeIconBtn}
          title="Remove from library"
          aria-label="Remove from library"
          disabled={isRemoving}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemoveFromLibrary();
          }}
        >
          <LibraryRemoveTrashIcon className={styles.removeIconSvg} />
        </button>
      )}
    </div>
  );
}

export default BookCard;
