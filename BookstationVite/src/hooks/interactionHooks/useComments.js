import { getCommentsByBook } from "../../api/comments";
import { useQuery } from "@tanstack/react-query";
import { PostComment } from "../../api/comments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "../queryKeys";

//fetch comments by book - query -
export const useCommentsByBook = (numericId) => {

    const {
        data: commentsData,
        isLoading: isCommentsLoading,
        error: commentsError,
    } = useQuery({
        queryKey: qk.comments.byBook(numericId),
        queryFn: () => getCommentsByBook(numericId),
        enabled: Number.isFinite(numericId),
    });

    const comments = commentsData?.data ?? commentsData ?? [];

    return { comments, isCommentsLoading, commentsError }
}

// post a comment - mutation hook - 
export const useAddComment = (numericId) => {
const queryClient = useQueryClient()
return useMutation({
    mutationFn: (newComment) => PostComment(numericId, newComment),
    onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: qk.comments.byBook(numericId) });
    },
    onError: (error) => {
      console.error("Failed to post comment", error)
    }
  })
}