import { useParams } from "react-router-dom";
import { useAllGenres } from "../../hooks/useGenres";
import styles from './GenresPage.module.css'
import BooksByGenre from "../../components/GenrePageComp/BooksByGenre";
import { MutationCache } from "@tanstack/react-query";


function GenresPage() {
    const params = useParams();
    const currentGenreType = params.type;

    const { genres, isGenresLoading, genresError } = useAllGenres()
    if (isGenresLoading) return <p className="loading">loading...</p>
    if (genresError) return <p className="loading">No books with this genre</p>
    const genreType = genres?.find(
        g => g.type.toLowerCase() === currentGenreType.toLowerCase()
    );
    if (!genreType) return <p className="loading">Genre not found.</p>;


    return (
        <div className={styles.mainContent}>
            <BooksByGenre genre={genreType.id} />

        </div>
    )
}

export default GenresPage;