import styles from "./BookCoverCard.module.css";
import { Link, useLocation } from "react-router-dom";
import { linkStateFromHere } from "../../../../utils/navigation";
import { addView } from "../../../../api/views";
import { Eye, Star, AlertTriangle, Edit3 } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL || "";

//format the ratings for book cards
function formatAvg(ratingAverage, book) {
  const v = ratingAverage ?? book?.ratingAverage;
  if (v == null || v === "") return "0.0";
  return typeof v === "number" ? v.toFixed(1) : String(v);
}

//the book cover card component thats being mapped on routes
function BookCoverCard({ book, ratingAverage }) {
  const location = useLocation();
  const coverSrc = book.coverImage?.startsWith("http")
    ? book.coverImage
    : `${BASE_URL}/${book.coverImage}`;

  // Evaluate states based on the updated logic
  const isDraft = book.status?.toUpperCase() === "DRAFT";
  const isFlagged = book.isFlagged === true;
  const isUnavailable = isDraft || isFlagged;

  const handleCardClick = (e) => {
    if (isDraft) {
      e.preventDefault(); // Stop navigation
      toast.error("This book is still a draft and cannot be viewed.");
      return;
    }
    
    if (isFlagged) {
      e.preventDefault(); // Stop navigation
      toast.error("This book has been flagged and is currently unavailable.");
      return;
    }

    // Only count view if it's actually navigating
    addView(book.id);
  };

  return (
    <Link
      onClick={handleCardClick}
      className={`${styles.link} ${isUnavailable ? styles.disabledLink : ""}`}
      to={`/book/${book.id}`}
      state={linkStateFromHere(location)}
      aria-disabled={isUnavailable}
    >
      <article className={styles.card}>
        {/* Fallback covers for Draft and Flagged statuses */}
        {isDraft ? (
          <div className={`${styles.statusCover} ${styles.draftCover}`}>
            <Edit3 size={32} strokeWidth={2} />
            <span>DRAFT</span>
          </div>
        ) : isFlagged ? (
          <div className={`${styles.statusCover} ${styles.flaggedCover}`}>
            <AlertTriangle size={32} strokeWidth={2} />
            <span>FLAGGED</span>
          </div>
        ) : (
          <img
            src={coverSrc}
            alt={book.name}
            className={styles.cover}
            loading="lazy"
          />
        )}

        {/* Overlay is now hidden by default and shown on hover via CSS */}
        <div className={styles.overlay}>
          <div className={styles.header}>
            <h3 className={styles.title}>{book.name}</h3>
            <p className={styles.author}>{book.author?.name}</p>
          </div>

          <div className={styles.stats}>
            <span className={styles.stat}>
              <Eye className={styles.eye} size={14} strokeWidth={2.5} />
              {book._count?.views ?? "—"}
            </span>
            <span className={styles.stat}>
              <Star className={styles.star} size={14} strokeWidth={2.5} />
              {formatAvg(ratingAverage, book)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default BookCoverCard;