import {
  createChapter,
  updateChapter,
  deleteChapter,
  publishChapter,
  unlockChapter,
} from "../../api/chapters";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "../queryKeys";

//unlock a chapter
export const useUnlockChapter = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (chapterId) => unlockChapter(chapterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.chapters.all() })
    },
  })
}

//create a chapter 
export const useCreateChapter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookId, title }) => createChapter(bookId, title),
    onSuccess: (_, { bookId }) => {
      queryClient.invalidateQueries({ queryKey: qk.chapters.byBook(bookId) });
    },
  });
};

//update a chapter
export const useUpdateChapter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chapterId, title, price }) =>
      updateChapter(chapterId, { title, price }),
    onSuccess: (_, { bookId }) => {
      if (bookId != null) {
        queryClient.invalidateQueries({ queryKey: qk.chapters.byBook(bookId) });
      }
      queryClient.invalidateQueries({ queryKey: qk.chapters.all() });
    },
    onError: (error) => {
      console.error(error?.message ?? "Failed to update chapter.");
    },
  });
};

//delete a chapter
export const useDeleteChapter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chapterId }) => deleteChapter(chapterId),
    onSuccess: (_, { bookId }) => {
      if (bookId != null) {
        queryClient.invalidateQueries({ queryKey: qk.chapters.byBook(bookId) });
      }
    },
    onError: (error) => {
      console.error(error?.message ?? "Failed to delete chapter.");
    },
  });
};

//publish a chapter
export const usePublishChapter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chapterId, price }) => publishChapter(chapterId, price),
    onSuccess: (_, { bookId }) => {
      if (bookId != null) {
        queryClient.invalidateQueries({ queryKey: qk.chapters.byBook(bookId) });
      }
    },
    onError: (error) => {
      console.error(error?.message ?? "Failed to publish chapter.");
    },
  });
};
