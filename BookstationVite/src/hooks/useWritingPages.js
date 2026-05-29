import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPagesForAuthor, upsertPrimaryPage } from "../api/pages";
import { qk } from "./queryKeys";

//move this to usePages 
//this hook fetches pages but for authors (if page/s empty then it still shows anyway for UI usage)
export const useAuthorPages = (chapterId) => {
  const {
    data: raw,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: qk.pages.author(chapterId),
    queryFn: () => getPagesForAuthor(chapterId),
    enabled: Number.isFinite(chapterId),
    staleTime: 0,
    refetchOnMount: "always",
  });

  const inner = raw?.data ?? raw;
  const pages = inner?.pages ?? [];
  const hasAccess = inner?.hasAccess ?? true;

  return { pages, hasAccess, isLoading, error, refetch };
};

//upsert page (page 1 holds all the content)
//each time an author writes it either creates the first page if it didnt exist
//or updates the existing page
export const useUpsertPrimaryPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chapterId, text }) => upsertPrimaryPage(chapterId, text),
    onSuccess: (_, { chapterId, bookId }) => {
      if (bookId != null) {
        queryClient.invalidateQueries({ queryKey: qk.chapters.byBook(bookId) });
      }
      queryClient.invalidateQueries({ queryKey: qk.pages.author(chapterId) });
      queryClient.invalidateQueries({ queryKey: qk.pages.reader(chapterId) }); // Make sure both are invalidated
    },
  });
};
