import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    }
  });

  return { saveProgress };
};