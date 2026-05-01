import { useState, useEffect, useCallback } from "react";
import { useUpdateBookStatus, useLaunchBook } from "../../../hooks/bookHooks/useBookMutations";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateChapter,
  useUpdateChapter,
  useDeleteChapter,
  usePublishChapter,
} from "../../../hooks/useChapters/useChaptersForAuthor";

function runMutation(mutation, variables, setError, { errorMessage, onSuccess }) {
  setError(null);
  mutation.reset();
  mutation.mutate(variables, {
    onError: (err) => setError(err?.message || errorMessage),
    onSuccess: () => {
      setError(null);
      onSuccess?.();
    },
  });
}

/**
 * Book status, chapter CRUD/publish, launch — shared error banner and busy flags.
 */
export function useWritingBookMutations({
  numericBookId,
  selectedChapterId,
  clearChapterFromUrl,
  chapterData,
}) {
  const [error, setError] = useState(null);

  const queryClient = useQueryClient();
  const createChapter = useCreateChapter();
  const updateChapter = useUpdateChapter();
  const deleteChapter = useDeleteChapter();
  const publishChapter = usePublishChapter();
  const updateBookStatus = useUpdateBookStatus();
  const launchBookMutation = useLaunchBook();


  const applyBookStatus = useCallback(
    (requestedStatus) => {
      runMutation(
        updateBookStatus,
        { bookId: numericBookId, requestedStatus },
        setError,
        { errorMessage: "Could not update status." },
      );
    },
    [numericBookId, updateBookStatus],
  );

  const handleStatusChange = useCallback(
    (e) => {
      applyBookStatus(e.target.value);
    },
    [applyBookStatus],
  );

  const handleDeleteChapter = useCallback(
    (inBook) => {
      runMutation(deleteChapter, inBook, setError, {
        errorMessage: "Could not delete chapter.",
        onSuccess: () => {
          if (selectedChapterId === inBook.chapterId) {
            clearChapterFromUrl();
          }
        },
      });
    },
    [deleteChapter, selectedChapterId, clearChapterFromUrl],
  );

  const handleCreateChapter = useCallback(
    (inBook) => {
      runMutation(createChapter, inBook, setError, {
        errorMessage: "Could not create chapter.",
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["chapters", inBook],
          });
        }
      });
    },
    [createChapter],
  );

  const handleUpdateChapter = useCallback(
    (inBook) => {
      runMutation(updateChapter, inBook, setError, {
        errorMessage: "Could not update chapter.",
      });
    },
    [updateChapter],
  );

  const handlePublishChapter = useCallback(
    (inBook) => {
      runMutation(publishChapter, inBook, setError, {
        errorMessage: "Could not publish chapter.",
      });
    },
    [publishChapter],
  );

  const handleLaunchBook = useCallback(
    (chapterPrices) => {
      runMutation(
        launchBookMutation,
        { bookId: numericBookId, chapterPrices },
        setError,
        { errorMessage: "Could not launch book." },
      );
    },
    [numericBookId, launchBookMutation],
  );

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  const chapter = chapterData?.chapter || null;

  const cannotEdit = chapter?.isPublished || null;

  const isBusy =
    createChapter.isPending ||
    updateChapter.isPending ||
    deleteChapter.isPending ||
    publishChapter.isPending ||
    launchBookMutation.isPending;

  return {
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
    isStatusPending: updateBookStatus.isPending,
    isLaunchPending: launchBookMutation.isPending,
  };
}
