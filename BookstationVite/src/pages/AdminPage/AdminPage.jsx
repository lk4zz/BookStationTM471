import { Loading } from "../../GlobalComponents/Feedback/Loading/Loading";

import { useAdminPage, ADMIN_MAX_VISIBLE_ROWS } from "./features/useAdminPage";
import { AdminSearchField } from "./sections/AdminSearchField/AdminSearchField";
import { AdminUsersSection } from "./sections/AdminUsersSection/AdminUsersSection";
import { AdminBooksSection } from "./sections/AdminBooksSection/AdminBooksSection";
import { AdminRadarSection } from "./sections/AdminRadarSection/AdminRadarSection";
import { AdminApplicationsSection } from "./sections/AdminApplicationsSection/AdminApplicationsSection"; 
import { AdminReviewQueueSection } from "./sections/AdminReviewQueueSection/AdminReviewQueueSection"; // NEW IMPORT
import { AdminTabs } from "./components/AdminTabs/AdminTabs";
import Navbar from "../../GlobalComponents/Layout/NavBar/NavBar";


import styles from "./AdminPage.module.css";

const AdminPage = () => {
  const {
    filteredUsers,
    userSearch,
    setUserSearch,
    userListTruncated,
    filteredBooks,
    bookSearch,
    setBookSearch,
    bookListTruncated,
    isUsersLoading,
    isBooksLoading,
    usersError,
    booksError,
    changeUserRole,
    isChangingRole,
    changeRoleError,
    banUser,
    isBanning,
    deleteBook,
    isDeletingBook,
    banError,
    deleteBookError,
    activeTab,
    setActiveTab,
    catalogBookCount,
    regularUserCount,
    currentUserRoleId,
    isCurrentUserLoading,

    // Moderation Queue Props
    reviewQueue,
    isReviewQueueLoading,
    flagBook,
    isFlaggingBook,
    unflagBook,
    isUnflaggingBooks,
    sendFeedbackAgain,
    isSendingFeedback,
  } = useAdminPage();

  if (isUsersLoading || isBooksLoading || isReviewQueueLoading || isCurrentUserLoading) return <Loading />;

  if (usersError || booksError) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.error}>Error loading admin data.</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Admin Dashboard</h1>

        {(banError || deleteBookError) && (
          <div className={styles.alertError}>
            {banError?.message || deleteBookError?.message}
          </div>
        )}

        <AdminTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          reviewQueue={reviewQueue} 
        />

        <div className={styles.tabPanels}>
          
          {activeTab === "users" && (
            <div role="tabpanel" className={styles.tabPanel}>
              <AdminSearchField
                id="admin-user-search"
                label="Search"
                value={userSearch}
                onChange={setUserSearch}
                placeholder="Name or email…"
              />
              {userListTruncated && (
                <p className={styles.meta}>
                  Showing first {ADMIN_MAX_VISIBLE_ROWS} matches — narrow your search for the rest.
                </p>
              )}
              <AdminUsersSection
                users={filteredUsers}
                onBanUser={banUser}
                isBanning={isBanning}
                showHeading
                platformHasNoUsers={regularUserCount === 0}
                searchQuery={userSearch}
                onChangeRole={changeUserRole}
                isChangingRole={isChangingRole}
                currentUserRoleId={currentUserRoleId}
              />
            </div>
          )}

          {activeTab === "books" && (
            <div role="tabpanel" className={styles.tabPanel}>
              <AdminSearchField
                id="admin-book-search"
                label="Search"
                value={bookSearch}
                onChange={setBookSearch}
                placeholder="Title or author…"
              />
              {bookListTruncated && (
                <p className={styles.meta}>
                  Showing first {ADMIN_MAX_VISIBLE_ROWS} matches.
                </p>
              )}
              <AdminBooksSection
                books={filteredBooks}
                onDeleteBook={deleteBook}
                isDeleting={isDeletingBook}
                flagBook={flagBook}
                isFlaggingBook={isFlaggingBook}
                showHeading
                catalogEmpty={catalogBookCount === 0}
                searchQuery={bookSearch}
              />
            </div>
          )}

          {activeTab === "reviews" && (
            <div role="tabpanel" className={styles.tabPanel}>
               <AdminReviewQueueSection 
                 queue={reviewQueue} 
                 onUnflag={unflagBook} 
                 isUnflagging={isUnflaggingBooks} 
                 onDeleteBook={deleteBook} 
                 isDeleting={isDeletingBook}
                 onBanUser={banUser}
                 isBanning={isBanning}
                 onSendFeedback={sendFeedbackAgain}
                 isSendingFeedback={isSendingFeedback}
               />
            </div>
          )}

          {activeTab === "applications" && (
            <div role="tabpanel" className={styles.tabPanel}>
              <AdminApplicationsSection />
            </div>
          )}

          {activeTab === "radar" && (
            <div role="tabpanel" className={styles.tabPanel}>
              <AdminRadarSection />
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminPage;