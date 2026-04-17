import BookCoverCard from "../../../../components/UI/BookCoverCard/BookCoverCard";
import CreateBookCard from "./components/CreateBookCard/CreateBookCard";
import styles from "./LandingTrendingSection.module.css";

function LandingTrendingSection({
  trendingBooks,
  isTrendingLoading,
  trendingError,
  viewsByBookId = {},
  ratingsByBookId = {},
}) {
  return (
    <section className={styles.showcase}>
      <div className={styles.showcaseHeader}>
        <h2>Trending on Bookstation</h2>
      </div>

      {isTrendingLoading ? (
        <p className={styles.loadingState}>Loading amazing stories...</p>
      ) : trendingError ? (
        <p className={styles.errorState}>Failed to load books. Please try again later.</p>
      ) : (
        <div className="gridContainer">
          {trendingBooks?.map((book) => (
            <BookCoverCard
              key={book.id}
              book={book}
              totalViews={viewsByBookId[book.id]}
              ratingAverage={ratingsByBookId[book.id]?.ratingAverage}
            />
          ))}

          <CreateBookCard />
        </div>
      )}
    </section>
  );
}

export default LandingTrendingSection;
