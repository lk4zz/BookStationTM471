import styles from "./Explore.module.css";
import NavBar from "../../components/UI/NavBar/NavBar";
import TrendingSection from "./sections/TrendingSection/TrendingSection";
import ExploreContent from "./sections/ExploreContent/ExploreContent";
import { Loading } from "../../components/UI/Loading/Loading";
import { useExplore } from "./features/useExplore";

function Explore() {
  const {
    searchQuery,
    setSearchQuery,
    books,
    isBooksLoading,
    booksError,
    trendingBooks,
    isTrendingLoading,
    trendingError,
    forYouBooks,
    isForYouLoading,
    forYouError,
    book,
    displayedBooks,
    viewsByBookId,
    ratingsByBookId,
    searchResults,
    isSearchLoading,
    searchError,
    isSearching,
  } = useExplore();

  if (!book || !books || isBooksLoading || isTrendingLoading || isForYouLoading)
    return (
      <div className={styles.pageShell}>
        <NavBar onSearch={setSearchQuery} />
        <div className={styles.loading}>
          <Loading />
        </div>
      </div>
    );
  if (booksError || trendingError || forYouError)
    return (
      <div className={styles.pageShell}>
        <NavBar onSearch={setSearchQuery} />
        <div className={styles.loading}>
          <Loading />
        </div>
      </div>
    );

  return (
    <div>
      <NavBar onSearch={setSearchQuery} />

      {!isSearching && (
        <section>
          <TrendingSection
            books={trendingBooks}
            viewsByBookId={viewsByBookId}
            ratingsByBookId={ratingsByBookId}
          />
        </section>
      )}

      <section>
        <ExploreContent
          searchQuery={searchQuery}
          displayedBooks={displayedBooks}
          viewsByBookId={viewsByBookId}
          ratingsByBookId={ratingsByBookId}
          forYouBooks={forYouBooks}
          searchResults={searchResults}
          isSearchLoading={isSearchLoading}
          searchError={searchError}
        />
      </section>
    </div>
  );
}

export default Explore;
