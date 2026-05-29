// features/useBookDetails.js
import { useBookById } from "../../../hooks/bookHooks/useBookQueries";
import { useChaptersByBook } from "../../../hooks/useChapters/useChaptersForUser";
import { useCommentsByBook } from "../../../hooks/interactionHooks/useComments";
import { useState } from "react";
import { useAddComment } from "../../../hooks/interactionHooks/useComments";
import { useRatings } from "../../../hooks/interactionHooks/useRatings";
import { useCreateReport } from "../../../hooks/interactionHooks/useReports";
import { useLibraryBooks } from "../../../hooks/useLibrary";
import { checkIfGuest } from "@/utils/checkIfGuest";
import toast from "react-hot-toast";

//this is a full feature hook that fetches all the data using the costume hooks in hooks folder
export function useBookDetails(numericId) {
  const [ratingModal, setRatinModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [reason, setReason] = useState("SPAM");
  const [comment, setComment] = useState("");
  const isGuest = checkIfGuest();

  //interaction/modals with guest check

  //rating modal
  const OpenRatinModal = () => {
    if (isGuest) {
      toast('Please log in to interact with books.', {
        icon: '🔒',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;

    }
    setRatinModal(true);
  }
  const closeRatinModal = () => setRatinModal(false);

  //report button action and modal
  const handleReportBtn = () => {
    if (isGuest) {
      toast('Please log in to interact with books.', {
        icon: '🔒',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }
    openReportModal();
  }

  const openReportModal = () => setReportModal(true);
  const closeReportModal = () => setReportModal(false);


  const handleSubmitReport = (e) => {
    e.preventDefault();
    createReportMutation.mutate(
      { bookId, reason, comment },
      {
        onSuccess: () => {
          setReason("SPAM");
          setComment("");
          onClose();
        },
      }
    );
  };

  const handleReportComment = (commentInput) => {
    setComment(commentInput)
  }

    const handleReportReason = (reason) => {
    setReason(reason)
  }

  const [commentInput, setCommentInput] = useState("");
  const submitCommentMutation = useAddComment(numericId);
  const createReportMutation = useCreateReport();

  const handleAddComment = () => {
    if (isGuest) {
      toast('Please log in to interact with books.', {
        icon: '🔒',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }
    if (!commentInput.trim()) return;
    submitCommentMutation.mutate(commentInput, {
      onSuccess: () => {
        setCommentInput("");
      },
    });
  };

  const { data: libraryBooks } = useLibraryBooks();
  const isBookInLibrary = libraryBooks?.some((b) => b.bookId === bookId);

  const { book, isBookLoading, bookError } = useBookById(numericId);
  const { chapters, isChapterLoading } = useChaptersByBook(numericId);
  const { comments, isCommentsLoading } = useCommentsByBook(numericId);
  const { ratingAverage, ratingCount } = useRatings(numericId);
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
    commentInput,
    setCommentInput,
    handleAddComment,
    submitCommentMutation,
    publishedChapters,
    ratingModal,
    OpenRatinModal,
    closeRatinModal,
    ratingAverage,
    ratingCount,
    reportModal,
    openReportModal,
    closeReportModal,
    createReportMutation,
    handleReportBtn,
    isBookInLibrary,
    handleAddComment,
    handleReportComment,
    handleReportReason,
    handleSubmitReport,
  
  };
}