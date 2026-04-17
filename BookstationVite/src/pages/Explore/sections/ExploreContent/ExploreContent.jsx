import Styles from "./ExploreContent.module.css";
import BooksCarousel from "../../../../components/UI/BooksCarousel/BooksCarousel";
import BookCoverCard from "../../../../components/UI/BookCoverCard/BookCoverCard";
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
}) {
  const isSearching = searchQuery?.trim().length > 0;

  if (isSearching) {
    if (isSearchLoading) return <Loading />;
    if (searchError) {
      return (
        <div className={Styles.exploreContent}>
          <p className="headers">Search</p>
          <p>{searchError.message || "Search failed."}</p>
        </div>
      );
    }

    return (
      <div className={Styles.exploreContent}>
        <p className="headers">Search Results</p>
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
      </div>
    );
  }

  return (
    <div className={Styles.exploreContent}>
      <p className="headers">Popular Books</p>
      <BooksCarousel
        books={displayedBooks}
        viewsByBookId={viewsByBookId}
        ratingsByBookId={ratingsByBookId}
      />

      <p className="headers">For you</p>
      <div className="gridContainer">
        {forYouBooks.map((book) => (
          <BookCoverCard
            key={book.id}
            book={book}
            totalViews={viewsByBookId[book.id]}
            ratingAverage={ratingsByBookId[book.id]?.ratingAverage}
          />
        ))}
      </div>
    </div>
  );
}

export default ExploreContent;
