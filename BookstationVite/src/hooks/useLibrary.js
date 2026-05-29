import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchLibraryBooks, removeBook, addBook } from "../api/libraryApi";
import { qk } from "./queryKeys";

//fetch user's library books to displayu in library
export const useLibraryBooks = () => {
  return useQuery({
    queryKey: qk.library.all(),
    queryFn: fetchLibraryBooks,
    retry: (failureCount, error) => {
      if (error?.status === 401 || error?.status === 403) {
        return false; 
      }
      return failureCount < 1; //failure to load try once only 
    },
  });
};

//remove a book from library mutation
export const useRemoveFromLibrary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeBook,
    onMutate: async (deletedBookId) => {
      await queryClient.cancelQueries({ queryKey: qk.library.all() });
      const previousLibrary = queryClient.getQueryData(qk.library.all());

      queryClient.setQueryData(qk.library.all(), (oldData) => {
        if (!oldData) return [];
        return oldData.filter((item) => Number(item.bookId) !== Number(deletedBookId));
      });

      return { previousLibrary };
    },
    //currently not using the error state must be added later at some point
    //ignore for now
    onError: (error, deletedBookId, context) => {
      queryClient.setQueryData(qk.library.all(), context.previousLibrary);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: qk.library.all() });
    },
  });
};

//add book to library mutation to create a db row 
export const useAddToLibrary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.library.all() });
    },
    onError: (error) => {
    }
  });
};