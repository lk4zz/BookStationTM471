import { useAllGenres } from "../../../hooks/useGenres";

export function useGenresPage(currentGenreType) {
  const { genres, isGenresLoading, genresError } = useAllGenres();
  const genreType = genres?.find(
    (g) =>
      g.type.toLowerCase() === (currentGenreType ?? "").toLowerCase()
  );

  return {
    genres,
    isGenresLoading,
    genresError,
    genreType,
  };
}
