import { getCommentsByBook } from "../api/comments";
import { useQuery } from "@tanstack/react-query";
import { PostComment } from "../api/comments";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCommentsByBook = (numericId) => {

    const {
        data: commentsData,
        isLoading: isCommentsLoading,
    } = useQuery({
        queryKey: ["comments", numericId],
        queryFn: () => getCommentsByBook(numericId),
        enabled: Number.isFinite(numericId),
    });

    const comments = commentsData?.data ?? commentsData ?? [];

    return { comments, isCommentsLoading }
}

export const useAddComment = (numericId) => {
const queryClient = useQueryClient()
return useMutation({
    mutationFn: (newComment) => PostComment(numericId, newComment),
    onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["comments", numericId] });
    },
    onError: (error) => {
      console.error("Failed to post comment", error)
    }
  })
}