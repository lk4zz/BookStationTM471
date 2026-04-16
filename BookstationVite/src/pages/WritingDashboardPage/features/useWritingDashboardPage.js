import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateBook, useDeleteBook, useBooksByAuthor } from "../../../hooks/useBooks";
import { checkIfGuest } from "../../../utils/checkIfGuest";
import { useCurrentUserId } from "../../../hooks/useUser";

export function useWritingDashboardPage() {
  const navigate = useNavigate();
  const { currentUserId } = useCurrentUserId();
  const [activeTab, setActiveTab] = useState("DRAFTS");
  const [isNewBookModalOpen, setNewBookModalOpen] = useState(false);
  const {
    booksByAuthor,
    isBooksByAuthorLoading,
    booksByAuthorError,
  } = useBooksByAuthor(currentUserId);

  const createBook = useCreateBook();
  const deleteBook = useDeleteBook();

  useEffect(() => {
    if (checkIfGuest()) {
      navigate("/login", { replace: true, state: { from: "/writing" } });
    }
  }, [navigate]);

  const handleCreate = (payload) => {
    createBook.mutate(payload, {
      onSuccess: () => setNewBookModalOpen(false),
    });
  };

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
    createBook,
    handleCreate,
    handleDelete,
  };
}
