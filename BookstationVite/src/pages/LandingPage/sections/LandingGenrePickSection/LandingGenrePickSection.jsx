import GenreBox from "./components/GenreBox/GenreBox";
import styles from "./LandingGenrePickSection.module.css";

function LandingGenrePickSection({ genres }) {
  return (
    <section className={styles.showcase}>
      <div className={styles.showcaseHeader} />
      <h1>Pick your favourite genre</h1>
      <div className={styles.genreBoxes}>
        {genres.map((genre) => (
          <GenreBox key={genre.id} genre={genre} />
        ))}
      </div>
    </section>
  );
}

export default LandingGenrePickSection;
