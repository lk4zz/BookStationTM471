import { getMostViewedBook } from "../api/views";
import { getViews } from "../api/views";
import { useQuery } from "@tanstack/react-query";

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