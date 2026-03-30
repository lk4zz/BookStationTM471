import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../../components/UI/NavBar/NavBar";
import CreateBookModal from "../../components/WritingDashboard/CreateBookModal/CreateBookModal";
import DraftBooksSection from "../../components/WritingDashboard/DraftBooksSection/DraftBooksSection";
import PageHeader from "../../components/WritingDashboard/PageHeader/PageHeader";

import { useDraftedBooks, useCreateBook, useDeleteBook } from "../../hooks/useBooks";
import { checkIfGuest } from "../../utils/checkIfGuest";
import styles from "./WritingDashboardPage.module.css";

function WritingDashboardPage() {
  const navigate = useNavigate();
  const [isNewBookModalOpen, setNewBookModalOpen] = useState(false);
  const { draftBooks, isDraftsloading, draftsError } = useDraftedBooks(); //fetch drafts
  const createBook = useCreateBook(); //create new draft
  const deleteBook = useDeleteBook(); //delete draft

  useEffect(() => {
    if (checkIfGuest()) {  //my utils function to checkif guest
      navigate("/login", { replace: true, state: { from: "/writing" } }); //navigate to log in
    }
  }, [navigate]);

  if (checkIfGuest()) return null;

  const handleCreate = (payload) => {
    createBook.mutate(payload, {
      onSuccess: () => setNewBookModalOpen(false),
    });
  };

  const handleDelete = (bookId) => {
    if (!window.confirm("Delete this draft book? This cannot be undone.")) return;
    deleteBook.mutate(bookId);
  };

  return (
    <div className={styles.page}>
      <NavBar />
      <main className={styles.main}>

        {/* section to add new books */}
        <PageHeader
          title="Writing"
          subtitle="Drafts stay private until you publish your book."
          onNewBook={() => setNewBookModalOpen(true)}
        />

        {/* draftbooks list */}
        <DraftBooksSection
          books={draftBooks}
          isLoading={isDraftsloading}
          error={draftsError}
          onDelete={handleDelete}
        />
      </main>

      {/* modal window that pops when creating a new book */}
      <CreateBookModal
        open={isNewBookModalOpen}
        onClose={() => setNewBookModalOpen(false)}
        onCreate={handleCreate}
        isPending={createBook.isPending}
      />
    </div>
  );
}

export default WritingDashboardPage;
