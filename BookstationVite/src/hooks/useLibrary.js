import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchLibraryBooks, removeBook, addBook } from "../api/libraryApi";

export const useLibraryBooks = () => {
  return useQuery({
    queryKey: ["library"],
    queryFn: fetchLibraryBooks,
    retry: (failureCount, error) => {
      if (error?.status === 401 || error?.status === 403) {
        return false; 
      }
      return failureCount < 1;
    },
  });
};

export const useRemoveFromLibrary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeBook,
    onMutate: async (deletedBookId) => {
      await queryClient.cancelQueries({ queryKey: ["library"] });
      const previousLibrary = queryClient.getQueryData(["library"]);

      queryClient.setQueryData(["library"], (oldData) => {
        if (!oldData) return [];
        return oldData.filter((item) => Number(item.bookId) !== Number(deletedBookId));
      });

      return { previousLibrary };
    },
    onError: (error, deletedBookId, context) => {
      queryClient.setQueryData(["library"], context.previousLibrary);
    },
    onSettled: () => {
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
    }
  });
};