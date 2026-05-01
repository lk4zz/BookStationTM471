import { useParams } from "react-router-dom";
import styles from "./GenresPage.module.css";
import GenresGrid from "./GenresGrid";
import { useGenresPage } from "./features/useGenresPage";

function GenresPage() {
  const params = useParams();
  const currentGenreType = params.type;

  const {
    isGenresLoading,
    genresError,
    genreType,
    books,
    isBooksLoading,
    booksError,
    ratingsByBookId,
  } = useGenresPage(currentGenreType);

  if (isGenresLoading || (genreType && isBooksLoading))
    return <p className="loading">loading...</p>;
  if (genresError)
    
    return (
      <p className="loading">{genresError.message || "No books with this genre"}</p>
    );
  if (!genreType) return <p className="loading">Genre not found.</p>;

  return (
    <div className={styles.mainContent}>
      <GenresGrid
        books={books}
        isBooksLoading={isBooksLoading}
        booksError={booksError}
        ratingsByBookId={ratingsByBookId}
      />
    </div>
  );
}

export default GenresPage;
