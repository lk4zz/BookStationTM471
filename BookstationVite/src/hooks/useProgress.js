import { useQuery, useMutation, useQueryClient, useQueries } from "@tanstack/react-query";
import { getReadingProgress, updateReadingProgress } from "../api/progress";

// use this on the Book Details page to know which chapter to route the user to
export const useGetProgress = (bookId) => {
  const {
    data: progressData,
    isLoading: isProgressLoading,
    error: progressError,
  } = useQuery({
    queryKey: ["progress", bookId],
    queryFn: () => getReadingProgress(bookId),
    enabled: Number.isFinite(bookId), // Only run if bookId is a valid number
  });

  const progress = progressData?.data ?? null;

  return { progress, isProgressLoading, progressError };
};

// use this on the actual Chapter reading page to save their spot
export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  const { mutate: saveProgress } = useMutation({
    mutationFn: updateReadingProgress,
    onSuccess: (data, variables) => {
      // Instantly invalidate the GET query so the book page "Continue" button is fresh
      queryClient.invalidateQueries(["progress", variables.bookId]);
      console.log("stored progress")
    }
  });

  return { saveProgress };
};

/** Batch progress for many books (e.g. library grid). */
export const useProgressForBookIds = (bookIds = []) => {
  const ids = [...new Set((bookIds || []).filter((id) => Number.isFinite(Number(id))).map(Number))];

  const results = useQueries({
    queries: ids.map((bookId) => ({
      queryKey: ["progress", bookId],
      queryFn: () => getReadingProgress(bookId),
      enabled: ids.length > 0,
    })),
  });

  const progressByBookId = ids.reduce((acc, id, i) => {
    const raw = results[i]?.data;
    acc[id] = raw?.data ?? raw ?? null;
    return acc;
  }, {});

  const isProgressLoading = results.some((r) => r.isPending);

  return { progressByBookId, isProgressLoading };
};