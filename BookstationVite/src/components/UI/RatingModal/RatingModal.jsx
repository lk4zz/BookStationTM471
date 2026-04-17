import { Rating } from "react-simple-star-rating";
import { useAddRating } from "../../../hooks/useRatings";
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
    <div className={styles.ratingModal}>
      <h3>Rate this book</h3>
      <Rating
        initialValue={0}
        onClick={(rate) => handleRating(rate)}
        allowFraction={true} 
        transition={true}
      />
      <button onClick={closeRatinModal}>Cancel</button>
    </div>
  );
}

export default RatingModal;
