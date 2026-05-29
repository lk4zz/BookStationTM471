import { useNavigate, useLocation } from "react-router-dom";
import { linkStateFromHere } from "../../../../../../utils/navigation";
import { useState } from "react";
import WarningModal from "../../../../../../GlobalComponents/Modals/WarningModal/WarningModal";
import {
  BookOpen,
  Eye,
  Star,
  AlertTriangle,
  Clock,
  Edit3,
  Trash2,
  Send
} from "lucide-react";
import styles from "./DashBookCards.module.css";
import { set } from "react-hook-form";

// Import API URL for local image resolution
const BASE_URL = import.meta.env.VITE_API_URL || "";

function DraftBookCard({ book, onDelete, activeTab, onOpenReviewModal, onOpenDeleteModal }) {
  const navigate = useNavigate();
  const location = useLocation();


  const isFlaggedTab = activeTab === "FLAGGED" && book.isFlagged;
  const isFlaggedActionItem = isFlaggedTab && !book.isUnderReview;

  // Safely extract stats
  const chapterCount = book._count?.chapters ?? 0;
  const viewCount = book._count?.views ?? 0;
  const ratingCount = book._count?.ratings ?? 0;
  const avgRating = book.averageRating ? Number(book.averageRating).toFixed(1) : "0.0";

  // Resolve cover image URL
  const coverSrc = book.coverImage
    ? (book.coverImage.startsWith("http")
      ? book.coverImage
      : `${BASE_URL}/${book.coverImage}`)
    : null;

  return (
    <article className={`${styles.card} ${isFlaggedTab ? styles.cardFlagged : ""}`}>

      {/* Left Area: Cover & Details */}
      <div className={styles.cardContent}>

        {/* Cover Art Area */}
        <div className={styles.coverArt}>
          {coverSrc ? (
            <img
              src={coverSrc}
              alt={book.name || "Book Cover"}
              className={styles.coverImage}
              loading="lazy"
            />
          ) : (
            <BookOpen size={28} className={styles.coverIcon} />
          )}
        </div>

        <div className={styles.details}>
          <div className={styles.headerRow}>
            <h3 className={styles.title} title={book.name}>
              {book.name || "Untitled Draft"}
            </h3>
            <span className={`${styles.badge} ${styles[`badge_${book.status}`] || styles.badge_DEFAULT}`}>
              {book.status?.toLowerCase() || "draft"}
            </span>
          </div>

          {/* Premium Stats Row */}
          <div className={styles.statsRow}>
            <span className={styles.statItem} title="Chapters">
              <BookOpen size={14} />
              {chapterCount} Chapter{chapterCount !== 1 ? "s" : ""}
            </span>
            <span className={styles.statDot}>•</span>
            <span className={styles.statItem} title="Total Views">
              <Eye size={14} />
              {viewCount.toLocaleString()}
            </span>
            <span className={styles.statDot}>•</span>
            <span className={styles.statItem} title="Rating">
              <Star size={14} className={avgRating > 0 ? styles.starActive : ""} />
              {avgRating} <span className={styles.statDim}>({ratingCount})</span>
            </span>
          </div>

          {/* Contextual Warning Banner for Flagged Books */}
          {isFlaggedTab && (
            <div className={`${styles.alertBanner} ${book.isUnderReview ? styles.alertPending : styles.alertDanger}`}>
              {book.isUnderReview ? (
                <>
                  <Clock size={16} />
                  <span><strong>Under Admin Review.</strong> Please wait for a moderator to approve your changes.</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={16} />
                  <span><strong>Action Required.</strong> This book is hidden. Fix the issues and submit for review.</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Area: Actions */}
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.btn} ${styles.editBtn}`}
          onClick={() => navigate(`/writing/${book.id}`, { state: linkStateFromHere(location) })}
        >
          <Edit3 size={16} /> Edit
        </button>

        {isFlaggedActionItem && (
          <button
            type="button"
            className={`${styles.btn} ${styles.submitBtn}`}
            onClick={() => onOpenReviewModal(book.id)}
          >
            <Send size={16} /> Submit Fix
          </button>
        )}


        <button
          type="button"
          className={`${styles.btn} ${styles.deleteBtn}`}
          onClick={() => onOpenDeleteModal(book)}
          aria-label="Delete book"
        >
          <Trash2 size={16} />
        </button>


      </div>

    </article>
  );
}

export default DraftBookCard;