import {
  createChapter,
  updateChapter,
  deleteChapter,
  publishChapter,
  unlockChapter,
} from "../../api/chapters";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
