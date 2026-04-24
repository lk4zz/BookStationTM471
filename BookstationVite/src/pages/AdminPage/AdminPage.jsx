import { Loading } from "../../components/UI/Loading/Loading";

import { useAdminPage, ADMIN_MAX_VISIBLE_ROWS } from "./features/useAdminPage";
import { AdminSearchField } from "./sections/AdminSearchField/AdminSearchField";
import { AdminUsersSection } from "./sections/AdminUsersSection/AdminUsersSection";
import { AdminBooksSection } from "./sections/AdminBooksSection/AdminBooksSection";
import { AdminRadarSection } from "./sections/AdminRadarSection/AdminRadarSection";

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
  } = useAdminPage();

  if (isUsersLoading || isBooksLoading) return <Loading />;

  if (usersError) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.error}>Error loading users: {usersError.message}</div>
      </div>
    );
  }
  if (booksError) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.error}>Error loading books: {booksError.message}</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Admin</h1>

        {(banError || deleteBookError) && (
          <div className={styles.alertError}>
            {banError?.message || deleteBookError?.message}
          </div>
        )}

        <div className={styles.tabRow} role="tablist" aria-label="Admin areas">
          <button
            type="button"
            className={styles.tabBtn}
            role="tab"
            id="tab-users"
            aria-selected={activeTab === "users"}
            aria-controls="admin-panel-users"
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            type="button"
            className={styles.tabBtn}
            role="tab"
            id="tab-books"
            aria-selected={activeTab === "books"}
            aria-controls="admin-panel-books"
            onClick={() => setActiveTab("books")}
          >
            Books
          </button>
          <button
            type="button"
            className={styles.tabBtn}
            role="tab"
            id="tab-radar"
            aria-selected={activeTab === "radar"}
            aria-controls="admin-panel-radar"
            onClick={() => setActiveTab("radar")}
          >
            Taste radar
          </button>
        </div>

        <div className={styles.tabPanels}>
          {activeTab === "users" && (
            <div
              id="admin-panel-users"
              role="tabpanel"
              aria-labelledby="tab-users"
              className={styles.tabPanel}
            >
              <AdminSearchField
                id="admin-user-search"
                label="Search"
                value={userSearch}
                onChange={setUserSearch}
                placeholder="Name or email…"
              />
              {userListTruncated && (
                <p className={styles.meta}>
                  Showing first {ADMIN_MAX_VISIBLE_ROWS} matches — narrow your search for
                  the rest.
                </p>
              )}
              <AdminUsersSection
                users={filteredUsers}
                onBanUser={banUser}
                isBanning={isBanning}
                showHeading
                platformHasNoUsers={regularUserCount === 0}
                searchQuery={userSearch}
              />
            </div>
          )}

          {activeTab === "books" && (
            <div
              id="admin-panel-books"
              role="tabpanel"
              aria-labelledby="tab-books"
              className={styles.tabPanel}
            >
              <AdminSearchField
                id="admin-book-search"
                label="Search"
                value={bookSearch}
                onChange={setBookSearch}
                placeholder="Title or author…"
              />
              {bookListTruncated && (
                <p className={styles.meta}>
                  Showing first {ADMIN_MAX_VISIBLE_ROWS} matches — narrow your search for
                  the rest.
                </p>
              )}
              <AdminBooksSection
                books={filteredBooks}
                onDeleteBook={deleteBook}
                isDeleting={isDeletingBook}
                showHeading
                catalogEmpty={catalogBookCount === 0}
                searchQuery={bookSearch}
              />
            </div>
          )}

          {activeTab === "radar" && (
            <div
              id="admin-panel-radar"
              role="tabpanel"
              aria-labelledby="tab-radar"
              className={styles.tabPanel}
            >
              <AdminRadarSection />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
