import NavBar from "../../components/UI/NavBar/NavBar";
import EditBookModal from "../../components/UI/EditBookModal/EditBookModal";
import styles from "./WritingDashboardPage.module.css";
import PageHeader from "./PageComponents/PageHeader/PageHeader";
import BookTabs from "./PageComponents/BookTabPanel/BookTabs";
import DashboardBooksSection from "./sections/DashboardBooksSection/DashboardBooksSection";
import { useWritingDashboardPage } from "./features/useWritingDashboardPage";
import Loading from "../../components/UI/Loading/Loading";
import AuthorApplicationView from "./PageComponents/AuthorApplicationView/AuthorApplicationView";

function WritingDashboardPage() {
  const {
    isGuest, activeTab, handleActiveTab, isNewBookModalOpen,
    setNewBookModalOpen, booksByAuthor, isBooksByAuthorLoading,
    booksByAuthorError, handleDelete, currentUser, isCurrentUserLoading,
  } = useWritingDashboardPage();

  if (isGuest) return null;
  if (isCurrentUserLoading) return <Loading />;
  if (currentUser?.roleId !== 2 && currentUser?.roleId !== 3)  return (
    <>
    <NavBar/>
    <AuthorApplicationView/>
    </>
    )


  return (
    <div className={styles.pageShell}>
      <NavBar />

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