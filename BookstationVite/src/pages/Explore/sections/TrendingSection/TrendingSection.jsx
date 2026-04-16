import styles from "./TrendingSection.module.css";
import TopBookSlider from "../../../../components/UI/TopBooksSlider/TopBooksSlider";

function TrendingSection({ books }) {
  return (
    <div className={styles.topPicks}>
      <TopBookSlider books={books} />
    </div>
  );
}

export default TrendingSection;
