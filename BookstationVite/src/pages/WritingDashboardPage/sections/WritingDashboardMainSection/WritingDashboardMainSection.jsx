import PageHeader from "./components/PageHeader/PageHeader";
import BookTabs from "./components/BookTabPanel/BookTabs";
import DashboardBooksSection from "./components/DraftBooksSection/DashboardBooksSection";
import styles from "./WritingDashboardMainSection.module.css";

function WritingDashboardMainSection({
  onNewBook,
  activeTab,
  handleActiveTab,
  booksByAuthor,
  isBooksByAuthorLoading,
  booksByAuthorError,
  onDelete,
}) {
  return (
    <main className={styles.main}>
      <PageHeader
        title="Writing"
        subtitle="Drafts stay private until you publish your book."
        onNewBook={onNewBook}
      />
      <div className={styles.booksPanel}>
        <BookTabs handleActiveTab={handleActiveTab} activeTab={activeTab} />

        <DashboardBooksSection
          booksByAuthor={booksByAuthor}
          isBooksByAuthorLoading={isBooksByAuthorLoading}
          booksByAuthorError={booksByAuthorError}
          isLoading={isBooksByAuthorLoading}
          error={booksByAuthorError}
          onDelete={onDelete}
          activeTab={activeTab}
        />
      </div>
    </main>
  );
}

export default WritingDashboardMainSection;
