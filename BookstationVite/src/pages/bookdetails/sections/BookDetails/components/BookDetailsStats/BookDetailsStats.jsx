// BookDetailsStats.jsx
import { Rating } from "react-simple-star-rating";
import { EyeIcon } from "../../../../../../GlobalComponents/Icons/IconLibrary";
import RatingModal from "../../../../../../GlobalComponents/Modals/RatingModal/RatingModal";
import styles from "./BookDetailsStats.module.css";
import { useBookDetailsContext } from "../../../../context/BookDetailsContext"; 

export default function BookDetailsStats() {
  // Grab everything directly from Context!
  const { 
    book, 
    ratingAverage, 
    ratingCount, 
    ratingModal, 
    OpenRatinModal, 
    closeRatinModal 
  } = useBookDetailsContext();

  const views = book?._count?.views;
  const bookId = book?.id; // Assuming book has an id property

  return (
    <div className={styles.statsRow}>
      <div className={styles.statItem}>
        <div onClick={OpenRatinModal} style={{ cursor: "pointer" }}>
          <Rating // Fixed typo: was Ratinag
            initialValue={ratingAverage}
            readonly
            allowFraction
            size={18}
            fillColor="#eab308"
            emptyColor="#3f3f46"
          />
        </div>

        {ratingModal && (
          <div>
            <RatingModal bookId={bookId} closeRatinModal={closeRatinModal} />
          </div>
        )}

        <span>({ratingCount} votes)</span>
      </div>
      
      <div className={styles.statItem}>
        <EyeIcon className={styles.iconEye} />
        <span>{views ?? "—"} Views</span>
      </div>
    </div>
  );
}