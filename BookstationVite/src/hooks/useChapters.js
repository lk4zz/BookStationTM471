import { getChaptersFromBook } from "../api/chapters";
import { useQuery } from "@tanstack/react-query";

export const useChaptersByBook = (numericId) => {

  const {
    data: chaptersData,
    isLoading: isChapterLoading,
    error: chapterError,
  } = useQuery({
    queryKey: ["chapters", numericId],
    queryFn: () => getChaptersFromBook(numericId),
    enabled: Number.isFinite(numericId),
  });

  const chapters = chaptersData?.data ?? chaptersData;

  return {chapters, isChapterLoading, chapterError}

  }