import { getMostViewedBook } from "../api/views";
import { getViews } from "../api/views";
import { useQueries, useQuery } from "@tanstack/react-query";

export const useViews = (numericId) => {

    const {
        data: viewsData,
        isLoading: isViewsLoading,
        error: viewsError,
    } = useQuery({
        queryKey: ["views", numericId],
        queryFn: () => getViews(numericId),
        enabled: Number.isFinite(numericId),
    });

    const totalViews = viewsData?.data || 0;

    return { totalViews, isViewsLoading, viewsError }

}

export const useViewsByBookIds = (bookIds = []) => {
    const viewQueries = useQueries({
        queries: bookIds.map((bookId) => ({
            queryKey: ["views", bookId],
            queryFn: () => getViews(bookId),
            enabled: Number.isFinite(bookId),
        })),
    });

    const viewsByBookId = bookIds.reduce((acc, bookId, index) => {
        acc[bookId] = viewQueries[index]?.data?.data;
        return acc;
    }, {});

    return { viewsByBookId, viewQueries };
};

export const useMostViewedBook = () => {
    const {
        data: mostViewedBookId,
        isLoading: isMostViewedBookLoading,
        error: mostViewedBookError,
    } = useQuery({
        queryKey: ["mostViewedBook"],
        queryFn: () => getMostViewedBook(),
        enabled: true,
    });

    const mostViewedBook = mostViewedBookId?.data || null;

    return { mostViewedBook, isMostViewedBookLoading, mostViewedBookError }

}
