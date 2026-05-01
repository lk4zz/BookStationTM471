import styles from "./TrendingSection.module.css";
import TopBookSlider from "../../../../components/UI/TopBooksSlider/TopBooksSlider";

function TrendingSection({ books, ratingsByBookId = {} }) {
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
