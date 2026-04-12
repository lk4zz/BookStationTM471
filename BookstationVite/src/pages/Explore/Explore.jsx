import { useState } from "react";
import Styles from "./explore.module.css";
import NavBar from "../../components/UI/NavBar/NavBar";
import TopBookSlider from "../../components/UI/TopBooksSlider/TopBooksSlider";
import ExploreContent from "../../components/ExplorePageComp/ExploreContent/ExploreContent";
import { useAllBooks } from "../../hooks/useBooks";
import { useTrendingBooks, useForYouBooks } from "../../hooks/useBooks";
import { useMostViewedBook, useViewsByBookIds } from "../../hooks/useViews";
import { useBookById } from "../../hooks/useBooks";
import Loading from "../../components/UI/Loading/Loading";

function Explore() {
  const [searchQuery, setSearchQuery] = useState("");

  const { books, isBooksLoading, booksError } = useAllBooks();
  const { trendingBooks, isTrendingLoading, trendingError } = useTrendingBooks();
  const { forYouBooks, isForYouLoading, forYouError } = useForYouBooks();
  const { mostViewedBook } = useMostViewedBook();
  const { book } = useBookById(mostViewedBook);
  const displayedBooks = books.slice(8, 21);
  const { viewsByBookId } = useViewsByBookIds(displayedBooks.map((b) => b.id));

  if (!book || !books || isBooksLoading || isTrendingLoading || isForYouLoading)
    return <Loading className={Styles.loading} />;
  if (booksError || trendingError || forYouError)
    return <Loading className={Styles.loading} />;

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div>
      <NavBar onSearch={setSearchQuery} />

      {!isSearching && (
        <div className={Styles.topPicks}>
          <TopBookSlider books={trendingBooks} />
        </div>
      )}

      <ExploreContent
        searchQuery={searchQuery}
        displayedBooks={displayedBooks}
        viewsByBookId={viewsByBookId}
        forYouBooks={forYouBooks}
      />
    </div>
  );
}

export default Explore;
