import styles from "./TrendingSection.module.css";
import TopBookSlider from "../../../../GlobalComponents/Books/BookGrids/TopBooksSlider/TopBooksSlider";
import SkeletonLoading from "../../../../GlobalComponents/Feedback/Loading/SkeletonLoading";
import { useExplore } from "../../features/useExplore";

function TrendingSection() {
  const {
    trendingBooks: books,
    isTrendingLoading: isLoading,
    trendingError: error,
    ratingsByBookId,
  } = useExplore();

  if (error) {
    return (
      <div className={styles.topPicks}>
        <p className={styles.sectionMessage}>Could not load trending books right now.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.topPicks}>
        <SkeletonLoading
          layout={[
            { type: "image", height: "380px", borderRadius: "18px" },
            { type: "title", width: "35%", height: "20px" },
          ]}
        />
      </div>
    );
  }

  return (
    <div className={styles.topPicks}>
      <TopBookSlider
        books={books}
        ratingsByBookId={ratingsByBookId}
      />
    </div>
  );
}

export default TrendingSection;