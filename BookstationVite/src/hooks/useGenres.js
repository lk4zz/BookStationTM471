import { getAllGenres } from "../api/genres";
//this must be used later to allow admins to add new genres
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { qk } from "./queryKeys";

//fetch all genres
export const useAllGenres = () => {
    const {
        data: genresData,
        isLoading: isGenresLoading,
        error: genresError
    } = useQuery({

        queryKey: qk.genres.all(),
        queryFn: getAllGenres,
    });

    const genres = genresData?.data ?? genresData ?? [];

    return { genres, isGenresLoading, genresError };
}