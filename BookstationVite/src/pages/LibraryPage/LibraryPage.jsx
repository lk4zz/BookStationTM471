import NavBar from "../../components/UI/NavBar/NavBar";
import styles from "./LibraryPage.module.css";
import LibraryGuestSection from "./sections/LibraryGuestSection/LibraryGuestSection";
import LibraryLoadingSection from "./sections/LibraryLoadingSection/LibraryLoadingSection";
import LibraryEmptySection from "./sections/LibraryEmptySection/LibraryEmptySection";
import LibraryErrorSection from "./sections/LibraryErrorSection/LibraryErrorSection";
import LibraryMainSection from "./sections/LibraryMainSection/LibraryMainSection";
import { useLibraryPage } from "./features/useLibraryPage";

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

  if (isGuest) {
    return (
      <div className={styles.pageWrapper}>
        <NavBar />
        <LibraryGuestSection />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <NavBar />
        <LibraryLoadingSection />
      </div>
    );
  }

  if (isError && error?.status === 404) {
    return (
      <div className={styles.pageWrapper}>
        <NavBar />
        <LibraryEmptySection />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.pageWrapper}>
        <NavBar />
        <LibraryErrorSection
          message={error?.message || "Oops! Something went wrong loading your library."}
        />
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <NavBar />
      <LibraryMainSection
        libraryItems={libraryItems}
        filteredSorted={filteredSorted}
        genres={genres}
        genreFilter={genreFilter}
        setGenreFilter={setGenreFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        isProgressLoading={isProgressLoading}
        progressByBookId={progressByBookId}
        onRemoveBook={(bookId) => removeMutation.mutate(bookId)}
        isRemoving={removeMutation.isPending}
      />
    </div>
  );
}

export default LibraryPage;
