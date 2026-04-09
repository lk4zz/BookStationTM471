import {
  getChaptersFromBook,
  getChaptersById,
  createChapter,
  updateChapter,
  deleteChapter,
  publishChapter,
  unlockChapter,
} from "../api/chapters";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

  return { chapters, isChapterLoading, chapterError }

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
  return { chapterData, isChapterLoading, chapterError }
}

export const useUnlockChapter = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (chapterId) => unlockChapter(chapterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] })
    },
  })
}

export const useCreateChapter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookId, title }) => createChapter(bookId, title),
    onSuccess: (_, { bookId }) => {
      queryClient.invalidateQueries({ queryKey: ["chapters", bookId] });
    },
  });
};

export const useUpdateChapter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chapterId, title, price }) =>
      updateChapter(chapterId, { title, price }),
    onSuccess: (_, { bookId }) => {
      if (bookId != null) {
        queryClient.invalidateQueries({ queryKey: ["chapters", bookId] });
      }
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
    onError: (error) => {
      console.error(error?.message ?? "Failed to update chapter.");
    },
  });
};

export const useDeleteChapter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chapterId }) => deleteChapter(chapterId),
    onSuccess: (_, { bookId }) => {
      if (bookId != null) {
        queryClient.invalidateQueries({ queryKey: ["chapters", bookId] });
      }
    },
    onError: (error) => {
      console.error(error?.message ?? "Failed to delete chapter.");
    },
  });
};

export const usePublishChapter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chapterId, price }) => publishChapter(chapterId, price),
    onSuccess: (_, { bookId }) => {
      if (bookId != null) {
        queryClient.invalidateQueries({ queryKey: ["chapters", bookId] });
      }
    },
    onError: (error) => {
      console.error(error?.message ?? "Failed to publish chapter.");
    },
  });
};