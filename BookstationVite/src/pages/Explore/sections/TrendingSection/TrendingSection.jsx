import styles from "./TrendingSection.module.css";
import TopBookSlider from "../../../../components/UI/TopBooksSlider/TopBooksSlider";

function TrendingSection({ books, viewsByBookId = {}, ratingsByBookId = {} }) {
  return (
    <div className={styles.topPicks}>
      <TopBookSlider
        books={books}
        viewsByBookId={viewsByBookId}
        ratingsByBookId={ratingsByBookId}
      />
    </div>
  );
}

export default TrendingSection;
