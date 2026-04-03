import { getPagesByChapter } from "../api/pages";
import { useQuery } from "@tanstack/react-query";

// this hook is for reading page fetching
export const usePagesByChatper =  (numericChapterId) => {
    const {
        data: pagesDataObjects,
        isLoading: isPagesLoading,
        error: pagesError
    } = useQuery({
        queryKey: ["pages", numericChapterId],
        queryFn: () => getPagesByChapter(numericChapterId),
        enabled: Number.isFinite(numericChapterId),

    });
    const pagesData = pagesDataObjects?.data ?? pagesDataObjects ?? [];

    return { pagesData, isPagesLoading, pagesError }

}


