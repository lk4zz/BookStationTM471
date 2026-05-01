import GenreSection from "./components/GenreSection/GenreSection";
import styles from "./LandingGenreSpotlightSection.module.css";

function LandingGenreSpotlightSection({
  randomGenre,
  genreSpotlightBooks,
  isGenreSpotlightBooksLoading,
  ratingsByBookId,
}) {
  if (!randomGenre) return null;

  return (
    <section className={styles.showcase}>
      <GenreSection
        genre={randomGenre}
        books={genreSpotlightBooks ?? []}
        isBooksLoading={isGenreSpotlightBooksLoading}
        ratingsByBookId={ratingsByBookId}
      />
    </section>
  );
}

export default LandingGenreSpotlightSection;
