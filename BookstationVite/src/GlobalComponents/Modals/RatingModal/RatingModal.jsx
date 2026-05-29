import { Rating } from "react-simple-star-rating";
import { useAddRating } from "../../../hooks/interactionHooks/useRatings";
import styles from "./RatingModal.module.css";

function RatingModal({ bookId, closeRatinModal }) {
  const addRatingMutation = useAddRating(bookId);

  const handleRating = (rate) => {
    addRatingMutation.mutate(rate, {
      onSuccess: () => {
        if (closeRatinModal) closeRatinModal();
      },
      onError: (error) => {
        console.error("Failed to submit rating:", error);
      },
    });
  };

  return (
    <div className={styles.overlay} onClick={closeRatinModal} role="presentation">
      <div 
        className={styles.modal} 
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rating-modal-heading"
      >
        <h2 id="rating-modal-heading" className={styles.heading}>Rate this book</h2>
        
        <div className={styles.ratingContainer}>
          <Rating
            initialValue={0}
            onClick={(rate) => handleRating(rate)}
            allowFraction={true} 
            transition={true}
          />
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={closeRatinModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default RatingModal;
