import { useState } from "react";
import { useAllBooks, useTrendingBooks, useForYouBooks, useBookById } from "../../../hooks/useBooks";
import { useMostViewedBook, useViewsByBookIds } from "../../../hooks/useViews";

export function useExplore() {
  const [searchQuery, setSearchQuery] = useState("");

  const { books, isBooksLoading, booksError } = useAllBooks();
  const { trendingBooks, isTrendingLoading, trendingError } = useTrendingBooks();
  const { forYouBooks, isForYouLoading, forYouError } = useForYouBooks();
  const { mostViewedBook } = useMostViewedBook();
  const { book } = useBookById(mostViewedBook);
  const displayedBooks = books.slice(8, 21);
  const { viewsByBookId } = useViewsByBookIds(displayedBooks.map((b) => b.id));

  const isSearching = searchQuery.trim().length > 0;

  return {
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
    isSearching,
  };
}
