import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../../components/UI/NavBar/NavBar";
import CreateBookModal from "../../components/WritingDashboard/CreateBookModal/CreateBookModal";
import DashboardBooksSection from "../../components/WritingDashboard/DraftBooksSection/DashboardBooksSection";
import PageHeader from "../../components/WritingDashboard/PageHeader/PageHeader";
import BookTabs from "../../components/WritingDashboard/BookTabPanel/BookTabs";

import { useCreateBook, useDeleteBook, useBooksByAuthor } from "../../hooks/useBooks";
import { checkIfGuest } from "../../utils/checkIfGuest";
import { useCurrentUserId } from "../../hooks/useUser";
import styles from "./WritingDashboardPage.module.css";

function WritingDashboardPage() {

  const navigate = useNavigate();
  const { currentUserId } = useCurrentUserId();
  const [activeTab, setActiveTab] = useState("DRAFTS");
  const [isNewBookModalOpen, setNewBookModalOpen] = useState(false);
  const { booksByAuthor, isBooksByAuthorLoading, booksByAuthorError
  } = useBooksByAuthor(currentUserId);

  
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

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
  }

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
      <div className={styles.booksPanel}>
        <BookTabs handleActiveTab={handleActiveTab} activeTab={activeTab} />
        
        {/* draftbooks list */}
        <DashboardBooksSection
          booksByAuthor={booksByAuthor}
          isBooksByAuthorLoading={isBooksByAuthorLoading}
          booksByAuthorError={booksByAuthorError}
          isLoading={isBooksByAuthorLoading}
          error={booksByAuthorError}
          onDelete={handleDelete}
          activeTab={activeTab}
        />
        </div>
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
