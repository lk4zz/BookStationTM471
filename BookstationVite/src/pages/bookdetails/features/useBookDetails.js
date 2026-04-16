import { useBookById } from "../../../hooks/useBooks";
import { useChaptersByBook } from "../../../hooks/useChapters";
import { useCommentsByBook } from "../../../hooks/useComments";
import { useViews } from "../../../hooks/useViews";
import { useState } from "react";
import { useAddComment } from "../../../hooks/useComments";

export function useBookDetails(numericId) {
  const [commentInput, setCommentInput] = useState("");
  const submitCommentMutation = useAddComment(numericId);

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    submitCommentMutation.mutate(commentInput, {
      onSuccess: () => {
        setCommentInput("");
      },
    });
  };

  const { book, isBookLoading, bookError } = useBookById(numericId);
  const { chapters, isChapterLoading } = useChaptersByBook(numericId);
  const { comments, isCommentsLoading } = useCommentsByBook(numericId);
  const { totalViews } = useViews(numericId);
  const publishedChapters = (Array.isArray(chapters) ? chapters : []).filter(
    (chapter) => chapter.isPublished
  );

  return {
    book,
    isBookLoading,
    bookError,
    chapters,
    isChapterLoading,
    comments,
    isCommentsLoading,
    totalViews,
    commentInput,
    setCommentInput,
    handleAddComment,
    submitCommentMutation,
    publishedChapters,
  };
}
