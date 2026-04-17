import { useMemo, useRef } from "react";
import { useAllBooks, useTrendingBooks, useBooksByGenre } from "../../../hooks/useBooks";
import { useAllGenres } from "../../../hooks/useGenres";
import { useViewsByBookIds } from "../../../hooks/useViews";
import { useRatingsByBookIds } from "../../../hooks/useRatings";

export function useLandingPage() {
  const { books, isBooksLoading, booksError } = useAllBooks();
  const { genres, isGenresLoading, genresError } = useAllGenres();
  const { trendingBooks, isTrendingLoading, trendingError } = useTrendingBooks();

  const spotlightIdxRef = useRef(null);
  const randomGenre = useMemo(() => {
    if (!genres?.length) return null;
    if (spotlightIdxRef.current === null) {
      // eslint-disable-next-line react-hooks/purity -- one random genre for landing spotlight
      spotlightIdxRef.current = Math.floor(Math.random() * genres.length);
    }
    return genres[spotlightIdxRef.current % genres.length];
  }, [genres]);

  const { books: genreSpotlightBooks, isBooksLoading: isGenreSpotlightBooksLoading } =
    useBooksByGenre(randomGenre?.id);

  const statsBookIds = useMemo(() => {
    const ids = new Set();
    (trendingBooks ?? []).forEach((b) => ids.add(b.id));
    (genreSpotlightBooks ?? []).forEach((b) => ids.add(b.id));
    return [...ids];
  }, [trendingBooks, genreSpotlightBooks]);

  const { viewsByBookId } = useViewsByBookIds(statsBookIds);
  const { ratingsByBookId } = useRatingsByBookIds(statsBookIds);

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
    genreSpotlightBooks,
    isGenreSpotlightBooksLoading,
    viewsByBookId,
    ratingsByBookId,
  };
}
