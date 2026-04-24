/**
 * Orchestrates the writing book page: data loading, chapter URL sync, mutations,
 * editor canvas (autosave), and modal shell state.
 */
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useBookById } from "../../../hooks/useBooks";
import { useChaptersByBook } from "../../../hooks/useChapters";
import { useAuthorPages } from "../../../hooks/useWritingPages";
import { checkIfGuest } from "../../../utils/checkIfGuest";
import { useWritingCanvas } from "../sections/WritingBookEditorSection/components/WritingCanvas/useWritingCanvas";
import { EMPTY_DOC_HTML } from "./writingMetrics";
import { useWritingChapterFromUrl } from "./useWritingChapterFromUrl";
import { useWritingBookMutations } from "./useWritingBookMutations";

export function useWritingBookPage(numericBookId) {
  const navigate = useNavigate();

  const [showEditBook, setShowEditBook] = useState(false);
  const [showLaunch, setShowLaunch] = useState(false);
  const [compWarning, setCompWarning] = useState(false);

  const { book, isBookLoading: bookLoading, bookError } = useBookById(
    numericBookId,
    true,
  );
  const { chapters, isChapterLoading: chaptersLoading } =
    useChaptersByBook(numericBookId);

  const { selectedChapterId, selectChapter, clearChapterFromUrl, chapterData } =
    useWritingChapterFromUrl(chapters);

  const { pages, isLoading: pagesLoading } = useAuthorPages(selectedChapterId);

  const {
    error,
    setError,
    handleStatusChange,
    applyBookStatus,
    handleDeleteChapter,
    handleCreateChapter,
    handleUpdateChapter,
    handlePublishChapter,
    handleLaunchBook,
    isBusy,
    cannotEdit,
    isStatusPending,
    isLaunchPending,
  } = useWritingBookMutations({
    numericBookId,
    selectedChapterId,
    clearChapterFromUrl,
    chapterData,
    });

  useEffect(() => {
    if (checkIfGuest()) navigate("/login", { replace: true });
  }, [navigate]);

  const onStatusChange = useCallback(
    (e) => {
      const requestedStatus = e.target.value;
      if (requestedStatus === "COMPLETED") {
        setCompWarning(true);
        return;
      }
      handleStatusChange(e);
    },
    [handleStatusChange],
  );

  const confirmCompletedStatus = useCallback(() => {
    applyBookStatus("COMPLETED");
    setCompWarning(false);
  }, [applyBookStatus]);

  const initialHtml = useMemo(
    () => pages?.[0]?.text ?? EMPTY_DOC_HTML,
    [pages, selectedChapterId],
  );

  const isLoading = chaptersLoading || pagesLoading;

  const { editor, words, approxPages, saveStatus } = useWritingCanvas({
    chapterId: selectedChapterId,
    bookId: numericBookId,
    initialHtml,
    isLoading,
  });

  return {
    book,
    bookLoading,
    bookError,
    chapters,
    chaptersLoading,
    pages,
    pagesLoading,
    selectedChapterId,
    selectChapter,
    initialHtml,
    isBusy,
    cannotEdit,
    handleStatusChange: onStatusChange,
    handleDeleteChapter,
    onCreateChapter: handleCreateChapter,
    onUpdateChapter: handleUpdateChapter,
    onPublishChapter: handlePublishChapter,
    handleLaunchBook,
    isStatusPending,
    isLaunchPending,
    error,
    setError,
    editor,
    words,
    approxPages,
    saveStatus,
    showEditBook,
    setShowEditBook,
    showLaunch,
    setShowLaunch,
    compWarning,
    setCompWarning,
    confirmCompletedStatus,
  };
}
