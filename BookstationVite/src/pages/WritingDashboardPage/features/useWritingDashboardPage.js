import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteBook } from "../../../hooks/bookHooks/useBookMutations";
import { useBooksByAuthor } from "../../../hooks/bookHooks/useBookQueries";
import { checkIfGuest } from "../../../utils/checkIfGuest";
import { useCurrentUser } from "../../../hooks/useUser";

export function useWritingDashboardPage() {
  const navigate = useNavigate();
  const { currentUser, isCurrentUserLoading } = useCurrentUser();
  const [activeTab, setActiveTab] = useState("DRAFTS");
  const [isNewBookModalOpen, setNewBookModalOpen] = useState(false);
  const {
    booksByAuthor,
    isBooksByAuthorLoading,
    booksByAuthorError,
  } = useBooksByAuthor(currentUser?.id);

  const deleteBook = useDeleteBook();

  useEffect(() => {
    if (checkIfGuest()) {
      navigate("/login", { replace: true, state: { from: "/writing" } });
    }
  }, [navigate]);

  const handleDelete = (bookId) => {
    if (!window.confirm("Delete this draft book? This cannot be undone.")) return;
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
    booksByAuthor,
    isBooksByAuthorLoading,
    booksByAuthorError,
    handleDelete,
    currentUser,
    isCurrentUserLoading,
  };
}
