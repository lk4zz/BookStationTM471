import { Rating } from "react-simple-star-rating";
import { EyeIcon } from "../../../../../../components/UI/Icons/IconLibrary";
import RatingModal from "../../../../../../components/UI/RatingModal/RatingModal";
import styles from "./BookDetailsStats.module.css";

export default function BookDetailsStats({
  bookId,
  views,
  ratingAverage,
  ratingCount,
  ratingModal,
  OpenRatinModal,
  closeRatinModal,
}) {
  return (
    <div className={styles.statsRow}>
      <div className={styles.statItem}>
        <div onClick={OpenRatinModal} style={{ cursor: "pointer" }}>
          <Rating
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