import { useMemo, useState } from "react";
import {
  useAllBooks,
  useTrendingBooks,
  useForYouBooks,
  useBookById,
  useBooksByAuthor,
  useBooksByFollowedAuthors,
} from "../../../hooks/useBooks";
import { useMostViewedBook, useViewsByBookIds } from "../../../hooks/useViews";
import { useRatingsByBookIds } from "../../../hooks/useRatings";
import { useSearch } from "../../../hooks/useSearch";

export function useExplore() {
  const [searchQuery, setSearchQuery] = useState("");

  const { books, isBooksLoading, booksError } = useAllBooks();
  const { trendingBooks, isTrendingLoading, trendingError } = useTrendingBooks();
  const { forYouBooks, isForYouLoading, forYouError } = useForYouBooks();
  const { mostViewedBook } = useMostViewedBook();
  const { book } = useBookById(mostViewedBook);
  const { booksByFollowedAuthors } = useBooksByFollowedAuthors();


  const displayedBooks = books.slice(8, 21);

  const { searchResults, isSearchLoading, searchError } = useSearch(searchQuery);

  const statsBookIds = useMemo(() => {
    const ids = new Set();
    (displayedBooks ?? []).forEach((b) => ids.add(b.id));
    (forYouBooks ?? []).forEach((b) => ids.add(b.id));
    (trendingBooks ?? []).forEach((b) => ids.add(b.id));
    (searchResults ?? []).forEach((b) => ids.add(b.id));
    (booksByFollowedAuthors ?? []).forEach((b) => ids.add(b.id));
    return [...ids];
  }, [displayedBooks, forYouBooks, trendingBooks, searchResults, booksByFollowedAuthors]);

  const { viewsByBookId } = useViewsByBookIds(statsBookIds);
  const { ratingsByBookId } = useRatingsByBookIds(statsBookIds);

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
    ratingsByBookId,
    searchResults,
    isSearchLoading,
    searchError,
    isSearching,
    booksByFollowedAuthors,
  };
}
