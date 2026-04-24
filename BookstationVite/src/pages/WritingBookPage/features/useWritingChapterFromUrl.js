import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useChapterById } from "../../../hooks/useChapters";

/**
 * Keeps `selectedChapterId` aligned with `?chapter=` and the loaded `chapters` list.
 * Invalid or missing query → first chapter and replaceState on the URL.
 */
export function useWritingChapterFromUrl(chapters) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedChapterId, setSelectedChapterId] = useState(null);

  useEffect(() => {
    if (!chapters?.length) {
      setSelectedChapterId(null);
      return;
    }
    const queryId = Number(searchParams.get("chapter"));
    const isValid =
      Number.isFinite(queryId) && chapters.some((c) => c.id === queryId);

    if (isValid) {
      setSelectedChapterId(queryId);
    } else {
      const firstId = chapters[0].id;
      setSelectedChapterId(firstId);
      setSearchParams({ chapter: String(firstId) }, { replace: true });
    }
  }, [chapters, searchParams, setSearchParams]);

  const selectChapter = useCallback(
    (id) => {
      setSelectedChapterId(id);
      id ? setSearchParams({ chapter: String(id) }) : setSearchParams({});
    },
    [setSearchParams],
  );

  const clearChapterFromUrl = useCallback(() => {
    setSelectedChapterId(null);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const { chapterData, isChapterLoading, chapterError } = useChapterById(selectedChapterId);
  if (chapterError) return;

  console.log("HEEEYYY", chapterData, selectedChapterId)

  return {
    selectedChapterId,
    selectChapter,
    clearChapterFromUrl,
    chapterData,
  };
}
