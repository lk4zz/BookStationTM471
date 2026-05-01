import NavBar from "../../components/UI/NavBar/NavBar";
import { Loading } from "../../components/UI/Loading/Loading";
import EmptyLibrary from "./components/EmptyLibrary/EmptyLibrary";
import LibraryToolbar from "./components/LibraryToolbar/LibraryToolbar";
import LibraryGrid from "./components/LibraryGrid/LibraryGrid";
import { useLibraryPage } from "./features/useLibraryPage";
import styles from "./LibraryPage.module.css";

function LibraryPage() {
  const {
    isGuest,
    libraryItems,
    isLoading,
    isError,
    error,
    removeMutation,
    genres,
    genreFilter,
    setGenreFilter,
    sortBy,
    setSortBy,
    filteredSorted,
    progressByBookId,
    isProgressLoading,
  } = useLibraryPage();

  const items = libraryItems ?? [];

  // --- States ---
  if (isGuest) {
    return (
      <div className={styles.pageWrapper}>
        <NavBar />
        <EmptyLibrary title="Log in to view your Library" body="Log in to view your Library" suggestion="Login" path="/login" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <NavBar />
        <main className={styles.centeredContent}><Loading /></main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.pageWrapper}>
        <NavBar />
        <main className={styles.centeredContent}>
          <div className={styles.errorText}>{error?.message || "Oops! Something went wrong loading your library."}</div>
        </main>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.pageWrapper}>
        <NavBar />
        <EmptyLibrary title="Your Library is Empty" body="You haven't added any books yet." suggestion="Explore Books" path="/explore" />
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className={styles.pageWrapper}>
      <NavBar />
      
      <main className={styles.mainContent}>
      <section className={styles.libraryToolbar}>
        <LibraryToolbar 
          itemsCount={items.length}
          genres={genres}
          genreFilter={genreFilter}
          setGenreFilter={setGenreFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        </section>

        {isProgressLoading && (
          <div className={styles.inlineLoad}>
            <Loading variant="inline" />
          </div>
        )}
        <section className={styles.libraryGrid}>
        <LibraryGrid 
          books={filteredSorted}
          progressByBookId={progressByBookId}
          onRemoveBook={(id) => removeMutation.mutate(id)}
          isRemoving={removeMutation.isPending}
        />
        </section>
      </main>
    </div>
  );
}

export default LibraryPage;