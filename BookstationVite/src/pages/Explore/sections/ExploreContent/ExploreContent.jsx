import Styles from "./ExploreContent.module.css";
import BooksCarousel from "../../../../components/UI/BooksCarousel/BooksCarousel";
import BookGrid from "../../../../components/UI/BookGrid/BookGrid";
import BookSlideExplore from "../../../../components/UI/BookSplideExplore/BookSplideExplore";
import BookCoverCard from "../../../../components/UI/BookCoverCard/BookCoverCard"; // Added missing import
import Loading from "../../../../components/UI/Loading/Loading";

function ExploreContent({
  searchQuery,
  displayedBooks,
  viewsByBookId = {},
  ratingsByBookId = {},
  forYouBooks,
  searchResults = [],
  isSearchLoading,
  searchError,
  booksByFollowedAuthors,
  allBooks,
  highEngagementBooks,
}) {
  const isSearching = searchQuery?.trim().length > 0;

  // 1. Loading & Error States
  if (isSearching && isSearchLoading) return <Loading />;

  if (isSearching && searchError) {
    return (
      <section className={Styles.exploreContent}>
        <h2 className={Styles.sectionHeader}>Search</h2>
        <p>{searchError.message || "Search failed."}</p>
      </section>
    );
  }

  // 2. Search Results View
  if (isSearching) {
    return (
      <section className={Styles.exploreContent}>
        <h2 className={Styles.sectionHeader}>Search Results</h2>
        {searchResults.length === 0 ? (
          <p>No books found for "{searchQuery}"</p>
        ) : (
          <div className="gridContainer">
            {searchResults.map((book) => (
              <BookCoverCard
                key={book.id}
                book={book}
                totalViews={viewsByBookId[book.id]}
                ratingAverage={ratingsByBookId[book.id]?.ratingAverage}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  const completedBooks = allBooks?.filter(book => book.status === "COMPLETED");

  return (
    <div className={Styles.exploreContent}>

      <section className={Styles.exploreSection}>
        <h2 className={Styles.sectionHeader}>People like</h2>
        <BooksCarousel
          books={highEngagementBooks}
          viewsByBookId={viewsByBookId}
          ratingsByBookId={ratingsByBookId}
        />
      </section>

      <section className={Styles.exploreSection}>
        <h2 className={Styles.sectionHeader}>For you</h2>
        <BookGrid
          books={forYouBooks}
          viewsByBookId={viewsByBookId}
          ratingsByBookId={ratingsByBookId}
          variant="featured"
        />
      </section>

      {booksByFollowedAuthors?.length > 0 && (
        <section className={Styles.exploreSection}>
          <h2 className={Styles.sectionHeader}>Authors you follow</h2>
          <BookGrid
            books={booksByFollowedAuthors}
            viewsByBookId={viewsByBookId}
            ratingsByBookId={ratingsByBookId}
            variant="default"
          />
        </section>
      )}

      <section className={Styles.exploreSection}>
        <h2 className={Styles.sectionHeader}>Completed Books</h2>
        <BookSlideExplore
          books={completedBooks}
          ratingsByBookId={ratingsByBookId}
        />
      </section>

      <section className={Styles.exploreSection}>
        <h2 className={Styles.sectionHeader}>Discover from a wide collection</h2>
        <BookGrid
          books={allBooks}
          viewsByBookId={viewsByBookId}
          ratingsByBookId={ratingsByBookId}
          variant="compact"
        />
      </section>

    </div>
  );
}

export default ExploreContent;