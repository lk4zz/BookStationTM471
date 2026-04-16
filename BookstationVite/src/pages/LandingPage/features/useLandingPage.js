import { useAllBooks, useTrendingBooks } from "../../../hooks/useBooks";
import { useAllGenres } from "../../../hooks/useGenres";

export function useLandingPage() {
  const { books, isBooksLoading, booksError } = useAllBooks();
  const { genres, isGenresLoading, genresError } = useAllGenres();
  const { trendingBooks, isTrendingLoading, trendingError } = useTrendingBooks();
  const randomGenre =
    genres[Math.floor(Math.random() * genres.length)];

  return {
    books,
    isBooksLoading,
    booksError,
    genres,
    isGenresLoading,
    genresError,
    trendingBooks,
    isTrendingLoading,
    trendingError,
    randomGenre,
  };
}
