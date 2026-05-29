import { addRating, getRatings, getBatchRatings } from "../../api/rate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "../queryKeys";

//fetch ratings
export const useRatings = (numericId) => {
    const {
        data: ratingsData,
        isLoading: isRatingsLoading,
        error: ratingsError,
    } = useQuery({
        queryKey: qk.ratings.byBook(numericId),
        queryFn: () => getRatings(numericId),
        enabled: Number.isFinite(numericId),
    });

    const stats = ratingsData?.data;
    const ratingAverage = stats?.ratingAverage ?? 0;
    const ratingCount = stats?.ratingCount ?? 0;
    

    return { ratingAverage, ratingCount, isRatingsLoading, ratingsError };
};

//add rating to a book when user views a book
export const useAddRating = (bookId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (rating) => addRating(bookId, rating),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: qk.ratings.byBook(bookId) });
        },
    });
};

//grab ratings in batches for book maps to prevent multiple db queries for performance
export const useRatingsByBookIds = (bookIds = []) => {
    const ids = (bookIds ?? []).filter(Number.isFinite);
    const { data, isLoading: isRatingsLoading, error: ratingsError } = useQuery({
        queryKey: qk.ratings.batch(ids),
        queryFn: () => getBatchRatings(ids),
        enabled: ids.length > 0,
        staleTime: 60_000,
    });
    const ratingsByBookId = data?.data ?? {};
    return { ratingsByBookId, isRatingsLoading, ratingsError };
};
