import NavBar from "../../GlobalComponents/Layout/NavBar/NavBar";
import EditBookModal from "../../GlobalComponents/Modals/EditBookModal/EditBookModal";
import styles from "./WritingDashboardPage.module.css";
import PageHeader from "./PageComponents/PageHeader/PageHeader";
import BookTabs from "./PageComponents/BookTabPanel/BookTabs";
import DashboardBooksSection from "./PageComponents/DashboardBooksSection/DashboardBooksSection";
import { useWritingDashboardPage } from "./features/useWritingDashboardPage";
import Loading from "../../GlobalComponents/Feedback/Loading/Loading";
import AuthorLandingPage from "./PageComponents/AuthorLanding/AuthorLandingPage";

function WritingDashboardPage() {
  const {
    isGuest, activeTab, handleActiveTab, isNewBookModalOpen,
    setNewBookModalOpen, booksByAuthor, isBooksByAuthorLoading,
    booksByAuthorError, handleDelete, currentUser, isCurrentUserLoading,
    setSearchQuery,
  } = useWritingDashboardPage();

  if (isGuest) return null;
  if (isCurrentUserLoading) return <Loading />;
  if (currentUser?.roleId !== 2 && currentUser?.roleId !== 3 && currentUser?.roleId !== 4)  return (
    <>
    <NavBar/>
    <AuthorLandingPage
    currentUser={currentUser}
    />
    </>
    )


  return (
    <div className={styles.pageShell}>
      <NavBar onSearch={setSearchQuery} />

      <main className={styles.dashboardContainer}>
        {/* Section 1: Intro/Actions */}
        <section className={styles.headerSection}>
          <PageHeader
            title="Writing"
            subtitle="Drafts stay private until you publish your book."
            onNewBook={() => setNewBookModalOpen(true)}
          />
        </section>

        {/* Section 2: Navigation & Content */}
        <section className={styles.contentSection}>
          <nav className={styles.tabNavigation}>
            <BookTabs handleActiveTab={handleActiveTab} activeTab={activeTab} />
          </nav>

          <div className={styles.resultsArea}>
            <DashboardBooksSection
              booksByAuthor={booksByAuthor}
              isBooksByAuthorLoading={isBooksByAuthorLoading}
              booksByAuthorError={booksByAuthorError}
              onDelete={handleDelete}
              activeTab={activeTab}
            />
          </div>
        </section>
      </main>

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