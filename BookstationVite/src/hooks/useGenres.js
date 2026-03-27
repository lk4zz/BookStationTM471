import { getAllGenres } from "../api/genres";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";


export const useAllGenres = () => {
    const {
        data: genresData,
        isLoading: isGenresLoading,
        error: genresError
    } = useQuery({

        queryKey: ["genres"],
        queryFn: getAllGenres,
    });

    const genres = genresData?.data ?? genresData ?? [];

    return { genres, isGenresLoading, genresError };
}