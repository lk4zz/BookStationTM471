import { useMemo, useState } from "react";
import {
  useAllBooks,
  useTrendingBooks,
  useForYouBooks,
  useBooksByFollowedAuthors,
  useHighEngagementBooks,
} from "../../../hooks/bookHooks/useBookQueries";
import { useRatingsByBookIds } from "../../../hooks/useRatings";
import { useSearch } from "../../../hooks/useSearch";

export function useExplore() {
  const [searchQuery, setSearchQuery] = useState("");

  const { books, isBooksLoading, booksError } = useAllBooks();
  const { trendingBooks, isTrendingLoading, trendingError } = useTrendingBooks();
  const { highEngagementBooks } = useHighEngagementBooks();
  const { forYouBooks, isForYouLoading, forYouError } = useForYouBooks();
  const { booksByFollowedAuthors } = useBooksByFollowedAuthors();


  const displayedBooks = books.filter(book => book.wordCount > 10);

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

  const { ratingsByBookId } = useRatingsByBookIds(statsBookIds);

  const isSearching = searchQuery.trim().length > 0;

  return {
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
  };
}
