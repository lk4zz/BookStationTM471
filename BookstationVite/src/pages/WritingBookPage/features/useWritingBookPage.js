import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useBookById, useUpdateBookStatus, useLaunchBook } from "../../../hooks/useBooks";
import { useChaptersByBook } from "../../../hooks/useChapters";
import { useAuthorPages } from "../../../hooks/useWritingPages";
import {
  useCreateChapter,
  useUpdateChapter,
  useDeleteChapter,
  usePublishChapter,
} from "../../../hooks/useChapters";
import { checkIfGuest } from "../../../utils/checkIfGuest";
import { useSearchParams } from "react-router-dom";
import { useWritingCanvas } from "../../../hooks/features/useWritingCanvas";

export function useWritingBookPage(numericBookId) {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [error, setError] = useState(null);
  const [showEditBook, setShowEditBook] = useState(false);
  const [showLaunch, setShowLaunch] = useState(false);

  const { book, isBookLoading: bookLoading, bookError } = useBookById(
    numericBookId,
    true
  );
  const { chapters, isChapterLoading: chaptersLoading } =
    useChaptersByBook(numericBookId);
  const { pages, isLoading: pagesLoading } = useAuthorPages(selectedChapterId);

  const createChapter = useCreateChapter();
  const updateChapter = useUpdateChapter();
  const deleteChapter = useDeleteChapter();
  const publishChapter = usePublishChapter();
  const updateBookStatus = useUpdateBookStatus();
  const launchBookMutation = useLaunchBook();

  useEffect(() => {
    if (checkIfGuest()) navigate("/login", { replace: true });
  }, [navigate]);

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

  const selectChapter = (id) => {
    setSelectedChapterId(id);
    id ? setSearchParams({ chapter: String(id) }) : setSearchParams({});
  };

  const initialHtml = useMemo(
    () => pages?.[0]?.text ?? "<p></p>",
    [pages, selectedChapterId]
  );

  console.log(initialHtml);

  const handleStatusChange = (e) => {
    setError(null);
    updateBookStatus.reset();
    updateBookStatus.mutate(
      { bookId: numericBookId, requestedStatus: e.target.value },
      {
        onError: (err) => setError(err?.message || "Could not update status."),
        onSuccess: () => setError(null),
      }
    );
  };

  const handleDeleteChapter = (inBook) => {
    setError(null);
    deleteChapter.reset();
    deleteChapter.mutate(inBook, {
      onError: (err) => setError(err?.message || "Could not delete chapter."),
      onSuccess: () => {
        setError(null);
        if (selectedChapterId === inBook.chapterId) {
          setSelectedChapterId(null);
          setSearchParams({}, { replace: true });
        }
      },
    });
  };

  const handleCreateChapter = (inBook) => {
    setError(null);
    createChapter.reset();
    createChapter.mutate(inBook, {
      onError: (err) => setError(err?.message || "Could not create chapter."),
      onSuccess: () => setError(null),
    });
  };

  const handleUpdateChapter = (inBook) => {
    setError(null);
    updateChapter.reset();
    updateChapter.mutate(inBook, {
      onError: (err) => setError(err?.message || "Could not update chapter."),
      onSuccess: () => setError(null),
    });
  };

  const handlePublishChapter = (inBook) => {
    setError(null);
    publishChapter.reset();
    publishChapter.mutate(inBook, {
      onError: (err) => setError(err?.message || "Could not publish chapter."),
      onSuccess: () => setError(null),
    });
  };

  const handleLaunchBook = (chapterPrices) => {
    setError(null);
    launchBookMutation.reset();
    launchBookMutation.mutate(
      { bookId: numericBookId, chapterPrices },
      {
        onError: (err) => setError(err?.message || "Could not launch book."),
        onSuccess: () => setError(null),
      }
    );
  };

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  const isBusy =
    createChapter.isPending ||
    updateChapter.isPending ||
    deleteChapter.isPending ||
    publishChapter.isPending ||
    launchBookMutation.isPending;

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
    handleStatusChange,
    handleDeleteChapter,
    onCreateChapter: handleCreateChapter,
    onUpdateChapter: handleUpdateChapter,
    onPublishChapter: handlePublishChapter,
    handleLaunchBook,
    isStatusPending: updateBookStatus.isPending,
    isLaunchPending: launchBookMutation.isPending,
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
  };
}
