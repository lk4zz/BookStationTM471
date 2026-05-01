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
    highEngagementBooks,
    trendingBooks,
    isTrendingLoading,
    trendingError,
    forYouBooks,
    isForYouLoading,
    forYouError,
    displayedBooks,
    ratingsByBookId,
    searchResults,
    isSearchLoading,
    searchError,
    isSearching,
    booksByFollowedAuthors,
  } = useExplore();

  if ( !books || isBooksLoading || isTrendingLoading || isForYouLoading)
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
            ratingsByBookId={ratingsByBookId}
          />
        </section>
      )}

      <section>
        <ExploreContent
          searchQuery={searchQuery}
          displayedBooks={displayedBooks}
          ratingsByBookId={ratingsByBookId}
          forYouBooks={forYouBooks}
          searchResults={searchResults}
          isSearchLoading={isSearchLoading}
          searchError={searchError}
          booksByFollowedAuthors={booksByFollowedAuthors}
          allBooks = {books}
          highEngagementBooks={highEngagementBooks}
        />
      </section>
    </div>
  );
}

export default Explore;
