// context/BookDetailsContext.jsx
import { createContext, useContext, useState } from "react";
import { useBookById } from "../../../hooks/bookHooks/useBookQueries";
import { useChaptersByBook } from "../../../hooks/useChapters/useChaptersForUser";
import { useCommentsByBook } from "../../../hooks/interactionHooks/useComments";
import { useAddComment } from "../../../hooks/interactionHooks/useComments";
import { useRatings } from "../../../hooks/interactionHooks/useRatings";
import { useCreateReport } from "../../../hooks/interactionHooks/useReports";
import { useLibraryBooks } from "../../../hooks/useLibrary";
import { checkIfGuest } from "@/utils/checkIfGuest";
import { useCurrentUser } from "@/hooks/UserHooks/UseUser";
import toast from "react-hot-toast";

// 1. Create the Context
const BookDetailsContext = createContext(null);

// 2. Create the Provider Component
export function BookDetailsProvider({ children, bookId }) {
  const [ratingModal, setRatinModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [reason, setReason] = useState("SPAM");
  const [comment, setComment] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const {currentUser, isCurrentUserLoading} = useCurrentUser();
  
  const isGuest = checkIfGuest();

  // Rating modal interactions
  const OpenRatinModal = () => {
    if (isGuest) {
      toast('Please log in to interact with books.', {
        icon: '🔒',
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
      });
      return;
    }
    setRatinModal(true);
  };
  
  const closeRatinModal = () => setRatinModal(false);

  // Report modal interactions
  const openReportModal = () => setReportModal(true);
  const closeReportModal = () => setReportModal(false);

  const handleReportBtn = () => {
    if (isGuest) {
      toast('Please log in to interact with books.', {
        icon: '🔒',
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
      });
      return;
    }
    openReportModal();
  };

  const createReportMutation = useCreateReport();

  const handleSubmitReport = (e) => {
    e.preventDefault();
    createReportMutation.mutate(
      { bookId, reason, comment },
      {
        onSuccess: () => {
          setReason("SPAM");
          setComment("");
          closeReportModal(); // Fixed: was onClose()
        },
      }
    );
  };

  const handleReportComment = (input) => setComment(input);
  const handleReportReason = (selectedReason) => setReason(selectedReason);

  // Comment interactions
  const submitCommentMutation = useAddComment(bookId);

  const handleAddComment = () => {
    if (isGuest) {
      toast('Please log in to interact with books.', {
        icon: '🔒',
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
      });
      return;
    }
    if (!commentInput.trim()) return;
    
    submitCommentMutation.mutate(commentInput, {
      onSuccess: () => setCommentInput(""),
    });
  };

  // Data fetching
  const { data: libraryBooks } = useLibraryBooks();
  const isBookInLibrary = libraryBooks?.some((b) => b.bookId === bookId); // Fixed: Ensure bookId is in scope

  const { book, isBookLoading, bookError } = useBookById(bookId);
  const { chapters, isChapterLoading } = useChaptersByBook(bookId);
  const { comments, isCommentsLoading } = useCommentsByBook(bookId);
  const { ratingAverage, ratingCount } = useRatings(bookId);
  
  const publishedChapters = (Array.isArray(chapters) ? chapters : []).filter(
    (chapter) => chapter.isPublished
  );

  // The value object containing everything the child components will need
  const value = {
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
    handleReportComment,
    handleReportReason,
    handleSubmitReport,
    currentUser,
    isCurrentUserLoading,
  };

  return (
    <BookDetailsContext.Provider value={value}>
      {children}
    </BookDetailsContext.Provider>
  );
}

// 3. Create a custom hook to easily consume the context
export function useBookDetailsContext() {
  const context = useContext(BookDetailsContext);
  if (!context) {
    throw new Error("useBookDetailsContext must be used within a BookDetailsProvider");
  }
  return context;
}