import { getChaptersFromBook, getChaptersById } from "../api/chapters";
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

  export const useChapterById = (chapterId) => {
    const {
      data: chapterDataOjects,
      isLoading: isChapterLoading,
      error: chapterError
    } = useQuery({
      queryKey: ["chapter", chapterId],
      queryFn: () => getChaptersById(chapterId),
      enabled: Number.isFinite(chapterId)
    });
    const chapterData = chapterDataOjects?.data ?? chapterDataOjects;
    return {chapterData, isChapterLoading, chapterError}
  }