import { addRating, getRatings } from "../api/rate";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";

export const useRatings = (numericId) => {
    const {
        data: ratingsData,
        isLoading: isRatingsLoading,
        error: ratingsError,
    } = useQuery({
        queryKey: ["ratings", numericId],
        queryFn: () => getRatings(numericId),
        enabled: Number.isFinite(numericId),
    });

    const stats = ratingsData?.data;
    const ratingAverage = stats?.ratingAverage ?? 0;
    const ratingCount = stats?.ratingCount ?? 0;
    

    return { ratingAverage, ratingCount, isRatingsLoading, ratingsError };
};

export const useAddRating = (bookId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (rating) => addRating(bookId, rating),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ratings", bookId] });
        },
    });
};

export const useRatingsByBookIds = (bookIds = []) => {
    const ratingQueries = useQueries({
        queries: bookIds.map((bookId) => ({
            queryKey: ["ratings", bookId],
            queryFn: () => getRatings(bookId),
            enabled: Number.isFinite(bookId),
        })),
    });

    const ratingsByBookId = bookIds.reduce((acc, bookId, index) => {
        acc[bookId] = ratingQueries[index]?.data?.data;
        return acc;
    }, {});

    return { ratingsByBookId, ratingQueries };
};
