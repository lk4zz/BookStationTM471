import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchLibraryBooks, removeBook, addBook } from "../api/libraryApi";

export const useLibraryBooks = () => {
  return useQuery({
    queryKey: ["library"],
    queryFn: fetchLibraryBooks,
    // do not retry on 404 (Empty Library) or 401/403 (Auth Errors)
    retry: (failureCount, error) => {
      if (error.response?.status === 404 || error.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
};

export const useRemoveFromLibrary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeBook,
    onSuccess: () => {
      // Invalidate and refetch library data immediately after a successful delete
      queryClient.invalidateQueries({ queryKey: ["library"] });
    },
  });
};

export const useAddToLibrary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library"] });
    },
    onError: (error) => {
      const backendError = error.response?.data?.message || "Failed to add book";
      console.log("Backend says:", backendError);
    }
  });
};