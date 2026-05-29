import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteBook } from "../../../hooks/bookHooks/useBookMutations";
import { useBooksByAuthor } from "../../../hooks/bookHooks/useBookQueries";
import { checkIfGuest } from "../../../utils/checkIfGuest";
import { useCurrentUser } from "../../../hooks/UserHooks/UseUser";
import { bookMatchesSearch } from "../../../utils/fuzzyNameSearch";

export function useWritingDashboardPage() {
  const navigate = useNavigate();
  const { currentUser, isCurrentUserLoading } = useCurrentUser();
  const [activeTab, setActiveTab] = useState("DRAFTS");
  const [isNewBookModalOpen, setNewBookModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const {
    booksByAuthor,
    isBooksByAuthorLoading,
    booksByAuthorError,
  } = useBooksByAuthor(currentUser?.id);

  const filteredBooksByAuthor = useMemo(() => {
    if (!booksByAuthor) return [];
    if (!searchQuery) return booksByAuthor;
    return booksByAuthor.filter(book => bookMatchesSearch(book, searchQuery));
  }, [booksByAuthor, searchQuery]);

  const deleteBook = useDeleteBook();

  useEffect(() => {
    if (checkIfGuest()) {
      navigate("/login", { replace: true, state: { from: "/writing" } });
    }
  }, [navigate]);

  const handleDelete = (bookId) => {
    deleteBook.mutate(bookId);
  };

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
  };

  return {
    isGuest: checkIfGuest(),
    activeTab,
    handleActiveTab,
    isNewBookModalOpen,
    setNewBookModalOpen,
    booksByAuthor: filteredBooksByAuthor,
    isBooksByAuthorLoading,
    booksByAuthorError,
    handleDelete,
    currentUser,
    isCurrentUserLoading,
    setSearchQuery,
  };
}
