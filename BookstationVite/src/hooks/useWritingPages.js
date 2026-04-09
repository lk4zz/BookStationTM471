import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPagesForAuthor, upsertPrimaryPage } from "../api/pages";

export const useAuthorPages = (chapterId) => {
  const {
    data: raw,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["pages", "author", chapterId],
    queryFn: () => getPagesForAuthor(chapterId),
    enabled: Number.isFinite(chapterId),
  });

  const inner = raw?.data ?? raw;
  const pages = inner?.pages ?? [];
  const hasAccess = inner?.hasAccess ?? true;

  return { pages, hasAccess, isLoading, error, refetch };
};

export const useUpsertPrimaryPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chapterId, text }) => upsertPrimaryPage(chapterId, text),
    onSuccess: (_, { chapterId, bookId }) => {
      if (bookId != null) {
        queryClient.invalidateQueries({ queryKey: ["chapters", bookId] });
      }
      queryClient.invalidateQueries({ queryKey: ["pages", chapterId] });
    },
  });
};
