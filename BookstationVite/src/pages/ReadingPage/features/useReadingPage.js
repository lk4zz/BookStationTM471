import { useEffect } from "react";
import { useChapterById, useChaptersByBook } from "../../../hooks/useChapters";
import { usePagesByChatper } from "../../../hooks/usePages";
import { useUpdateProgress } from "../../../hooks/useProgress";

export function useReadingPage(numericBookId, numericChapterId) {
  const { chapters, isChaptersLoading } = useChaptersByBook(numericBookId);
  const { chapterData, isChapterLoading } = useChapterById(numericChapterId);
  const { pagesData, isPagesLoading } = usePagesByChatper(numericChapterId);

  const { saveProgress } = useUpdateProgress();
  useEffect(() => {
    if (numericBookId && numericChapterId) {
      saveProgress({ bookId: numericBookId, chapterId: numericChapterId });
    }
  }, [numericBookId, numericChapterId, saveProgress]);

  const { chapter } = chapterData ?? {};
  const pages = Array.isArray(pagesData) ? pagesData : pagesData?.pages ?? [];
  const firstPage = pages[0] ?? { id: 0, text: "" };

  const isBootLoading = isChaptersLoading || isChapterLoading;
  const isContentLoading = isPagesLoading;

  return {
    chapters,
    chapter,
    isChapterLoading,
    isChaptersLoading,
    isBootLoading,
    isContentLoading,
    isPagesLoading,
    firstPage,
    pages,
  };
}
