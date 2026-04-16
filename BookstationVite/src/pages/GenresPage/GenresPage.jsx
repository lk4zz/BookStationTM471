import { useParams } from "react-router-dom";
import styles from "./GenresPage.module.css";
import GenresBooksSection from "./sections/GenresBooksSection/GenresBooksSection";
import { useGenresPage } from "./features/useGenresPage";

function GenresPage() {
  const params = useParams();
  const currentGenreType = params.type;

  const { isGenresLoading, genresError, genreType } =
    useGenresPage(currentGenreType);

  if (isGenresLoading) return <p className="loading">loading...</p>;
  if (genresError)
    
    return (
      <p className="loading">{genresError.message || "No books with this genre"}</p>
    );
  if (!genreType) return <p className="loading">Genre not found.</p>;

  return (
    <div className={styles.mainContent}>
      <GenresBooksSection genre={genreType.id} />
    </div>
  );
}

export default GenresPage;
