import NavBar from "../../components/UI/NavBar/NavBar";
import styles from "./WritingDashboardPage.module.css";
import WritingDashboardMainSection from "./sections/WritingDashboardMainSection/WritingDashboardMainSection";
import WritingDashboardCreateBookModalSection from "./sections/WritingDashboardCreateBookModalSection/WritingDashboardCreateBookModalSection";
import { useWritingDashboardPage } from "./features/useWritingDashboardPage";

function WritingDashboardPage() {
  const {
    isGuest,
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
  } = useWritingDashboardPage();

  if (isGuest) return null;

  return (
    <div className={styles.page}>
      <NavBar />
      <WritingDashboardMainSection
        onNewBook={() => setNewBookModalOpen(true)}
        activeTab={activeTab}
        handleActiveTab={handleActiveTab}
        booksByAuthor={booksByAuthor}
        isBooksByAuthorLoading={isBooksByAuthorLoading}
        booksByAuthorError={booksByAuthorError}
        onDelete={handleDelete}
      />

      <WritingDashboardCreateBookModalSection
        open={isNewBookModalOpen}
        onClose={() => setNewBookModalOpen(false)}
        onCreate={handleCreate}
        isPending={createBook.isPending}
      />
    </div>
  );
}

export default WritingDashboardPage;
