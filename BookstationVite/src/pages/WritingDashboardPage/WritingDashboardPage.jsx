import NavBar from "../../components/UI/NavBar/NavBar";
import EditBookModal from "../../components/UI/EditBookModal/EditBookModal";
import styles from "./WritingDashboardPage.module.css";
import WritingDashboardMainSection from "./sections/WritingDashboardMainSection/WritingDashboardMainSection";
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

      {isNewBookModalOpen && (
        <EditBookModal
          book={null}
          onClose={() => setNewBookModalOpen(false)}
        />
      )}
    </div>
  );
}

export default WritingDashboardPage;
