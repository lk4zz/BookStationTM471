import GenreSection from "./components/GenreSection/GenreSection";
import styles from "./LandingGenreSpotlightSection.module.css";

function LandingGenreSpotlightSection({ randomGenre }) {
  return (
    <section className={styles.showcase}>
      <GenreSection genre={randomGenre} />
    </section>
  );
}

export default LandingGenreSpotlightSection;
