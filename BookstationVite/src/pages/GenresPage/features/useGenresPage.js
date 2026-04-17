import { useMemo } from "react";
import { useAllGenres } from "../../../hooks/useGenres";
import { useBooksByGenre } from "../../../hooks/useBooks";
import { useViewsByBookIds } from "../../../hooks/useViews";
import { useRatingsByBookIds } from "../../../hooks/useRatings";

export function useGenresPage(currentGenreType) {
  const { genres, isGenresLoading, genresError } = useAllGenres();
  const genreType = genres?.find(
    (g) => g.type.toLowerCase() === (currentGenreType ?? "").toLowerCase()
  );

  const genreId = genreType?.id;
  const { books, isBooksLoading, booksError } = useBooksByGenre(genreId);

  const bookIds = useMemo(
    () => (books ?? []).map((b) => b.id).filter((id) => Number.isFinite(Number(id))),
    [books]
  );
  const { viewsByBookId } = useViewsByBookIds(bookIds);
  const { ratingsByBookId } = useRatingsByBookIds(bookIds);

  return {
    genres,
    isGenresLoading,
    genresError,
    genreType,
    books,
    isBooksLoading,
    booksError,
    viewsByBookId,
    ratingsByBookId,
  };
}
