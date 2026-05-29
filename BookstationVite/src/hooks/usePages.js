import { getPagesByChapter } from "../api/pages";
import { useQuery } from "@tanstack/react-query";
import { qk } from "./queryKeys";

// this hook is for reading page fetching
//it fetches the pages by chapter for readers
export const usePagesByChatper =  (numericChapterId) => {
    const {
        data: pagesDataObjects,
        isLoading: isPagesLoading,
        error: pagesError
    } = useQuery({
        queryKey: qk.pages.reader(numericChapterId),
        queryFn: () => getPagesByChapter(numericChapterId),
        enabled: Number.isFinite(numericChapterId),
        onError (error) {
            console.error(error)
        }
    },
    
    );
    const pagesData = pagesDataObjects?.data ?? pagesDataObjects ?? [];

    return { pagesData, isPagesLoading, pagesError }

}


