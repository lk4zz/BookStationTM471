import Styles from "./ExploreContent.module.css";
import BooksCarousel from "../../../../GlobalComponents/Books/BookGrids/BooksCarousel/BooksCarousel";
import BookGrid from "../../../../GlobalComponents/Books/BookGrids/ExploreBookGrid/ExploreBookGrid";
import BookSlideExplore from "../../../../GlobalComponents/Books/BookGrids/BookSplideExplore/BookSplideExplore";
import SkeletonLoading from "../../../../GlobalComponents/Feedback/Loading/SkeletonLoading";
import SearchContent from "./Components/SearchContent/SearchContent";

import {
  Flame,
  Sparkles,
  Users,
  CheckCircle2,
  Compass,
  Search,
} from "lucide-react";
import { useExplore } from "../../features/useExplore";

function ExploreContent({ searchQuery, viewsByBookId = {} }) {
  // Fetch data fresh using the custom hook
  const {
    ratingsByBookId,
    forYouBooks,
    searchResults,
    isSearchLoading,
    searchError,
    isSearching,
    booksByFollowedAuthors,
    highEngagementBooks,
    isHighEngagementLoading,
    highEngagementError,
    isForYouLoading,
    forYouError,
    isBooksByFollowedAuthorsLoading,
    booksByFollowedAuthorsError,
    discoverBooks,
    isDiscoverLoading,
    discoverError,
    completedBooks,
    isCompletedLoading,
    completedError,
  } = useExplore(searchQuery);

  if (isSearching && isSearchLoading) {
    return (
      <section className={Styles.searchContent}>
        <div className={Styles.searchHeader}>
          <div className={Styles.sectionTitleWrap}>
            <Search className={Styles.sectionIcon} />
            <h2 className={Styles.sectionHeader}>Search</h2>
          </div>
        </div>

        <div className={Styles.sectionCard}>
          <SkeletonLoading
            layout={[
              { type: "title", width: "38%", height: "30px" },
              "avatar",
              { type: "title", width: "55%", height: "20px" },
              "text",
              "text",
              { type: "image", height: "260px" },
            ]}
          />
        </div>
      </section>
    );
  }

  if (isSearching && searchError) {
    return (
      <section className={Styles.exploreContent}>
        <div className={Styles.searchHeader}>
          <div className={Styles.sectionTitleWrap}>
            <Search className={Styles.sectionIcon} />
            <h2 className={Styles.sectionHeader}>Search</h2>
          </div>
        </div>

        <div className={Styles.sectionCard}>
          <p>{searchError.message || "Search failed."}</p>
        </div>
      </section>
    );
  }

  if (isSearching) {
    return (
      <SearchContent
        searchQuery={searchQuery}
        searchResults={searchResults}
        viewsByBookId={viewsByBookId}
        ratingsByBookId={ratingsByBookId}
      />
    );
  }

  const shouldRenderFollowedAuthorsSection =
    isBooksByFollowedAuthorsLoading || booksByFollowedAuthors?.length > 0;

  return (
    <div className={Styles.exploreContent}>
      
      <section className={Styles.exploreSection}>
        <div className={Styles.sectionTop}>
          <div className={Styles.sectionTitleWrap}>
            <Flame className={Styles.sectionIcon} />
            <h2 className={Styles.sectionHeader}>People like</h2>
          </div>

          <span className={Styles.sectionHint}>
            High engagement picks
          </span>
        </div>

        <div className={Styles.sectionCard}>
          {highEngagementError ? (
            <p className={Styles.sectionMessage}>
              Could not load this section.
            </p>
          ) : isHighEngagementLoading ? (
            <SkeletonLoading
              layout={[
                { type: "image", height: "260px" },
                { type: "title", width: "28%", height: "18px" },
              ]}
            />
          ) : (
            <BooksCarousel
              books={highEngagementBooks}
              viewsByBookId={viewsByBookId}
              ratingsByBookId={ratingsByBookId}
            />
          )}
        </div>
      </section>

      {forYouBooks?.length > 3 && (
      <section className={Styles.exploreSection}>
        <div className={Styles.sectionTop}>
          <div className={Styles.sectionTitleWrap}>
            <Sparkles className={Styles.sectionIcon} />
            <h2 className={Styles.sectionHeader}>For you</h2>
          </div>

          <span className={Styles.sectionHint}>
            Personalized recommendations
          </span>
        </div>

        <div className={Styles.sectionCard}>
          {forYouError ? (
            <p className={Styles.sectionMessage}>
              Could not load personalized picks.
            </p>
          ) : isForYouLoading ? (
            <SkeletonLoading
              layout={[
                { type: "image", height: "280px" },
                { type: "title", width: "42%", height: "20px" },
                "text",
              ]}
            />
          ) : (
            <BookGrid
              books={forYouBooks}
              viewsByBookId={viewsByBookId}
              ratingsByBookId={ratingsByBookId}
              variant="featured"
            />
          )}
        </div>
      </section>
      )}

      {shouldRenderFollowedAuthorsSection && (
        <section className={Styles.exploreSection}>
          <div className={Styles.sectionTop}>
            <div className={Styles.sectionTitleWrap}>
              <Users className={Styles.sectionIcon} />
              <h2 className={Styles.sectionHeader}>
                Authors you follow
              </h2>
            </div>

            <span className={Styles.sectionHint}>
              Latest from your circle
            </span>
          </div>

          <div className={Styles.sectionCard}>
            {booksByFollowedAuthorsError ? (
              <p className={Styles.sectionMessage}>
                Could not load followed authors.
              </p>
            ) : isBooksByFollowedAuthorsLoading ? (
              <SkeletonLoading
                layout={[
                  { type: "image", height: "240px" },
                  { type: "title", width: "36%", height: "18px" },
                ]}
              />
            ) : (
              <BookGrid
                books={booksByFollowedAuthors}
                viewsByBookId={viewsByBookId}
                ratingsByBookId={ratingsByBookId}
                variant="default"
              />
            )}
          </div>
        </section>
      )}

      <section className={Styles.exploreSection}>
        <div className={Styles.sectionTop}>
          <div className={Styles.sectionTitleWrap}>
            <CheckCircle2 className={Styles.sectionIcon} />
            <h2 className={Styles.sectionHeader}>
              Completed Books
            </h2>
          </div>

          <span className={Styles.sectionHint}>
            Finished by readers
          </span>
        </div>

        <div className={Styles.sectionCard}>
          {completedError ? (
            <p className={Styles.sectionMessage}>
              Could not load completed books.
            </p>
          ) : isCompletedLoading ? (
            <SkeletonLoading
              layout={[
                { type: "image", height: "180px" },
                { type: "title", width: "32%", height: "18px" },
              ]}
            />
          ) : (
            <BookSlideExplore
              books={completedBooks}
              ratingsByBookId={ratingsByBookId}
            />
          )}
        </div>
      </section>

      <section className={Styles.exploreSection}>
        <div className={Styles.sectionTop}>
          <div className={Styles.sectionTitleWrap}>
            <Compass className={Styles.sectionIcon} />
            <h2 className={Styles.sectionHeader}>
              Discover from a wide collection
            </h2>
          </div>

          <span className={Styles.sectionHint}>
            Expand your library
          </span>
        </div>

        <div className={Styles.sectionCard}>
          {discoverError ? (
            <p className={Styles.sectionMessage}>
              Could not load discover books.
            </p>
          ) : isDiscoverLoading ? (
            <SkeletonLoading
              layout={[
                { type: "image", height: "220px" },
                { type: "title", width: "26%", height: "18px" },
                "text",
              ]}
            />
          ) : (
            <BookGrid
              books={discoverBooks}
              viewsByBookId={viewsByBookId}
              ratingsByBookId={ratingsByBookId}
              variant="compact"
            />
          )}
        </div>
      </section>

    </div>
  );
}

export default ExploreContent;