import { useMemo } from "react";
import {
  useTrendingBooks,
  useForYouBooks,
  useBooksByFollowedAuthors,
  useHighEngagementBooks,
  useDiscoverBooks,
  useCompletedBooks,
} from "../../../hooks/bookHooks/useBookQueries";
import { useRatingsByBookIds } from "../../../hooks/interactionHooks/useRatings";
import { useSearch } from "../../../hooks/useSearch";

export function useExplore(searchQuery = "") {
  const { trendingBooks, isTrendingLoading, trendingError } = useTrendingBooks(10);
  const {
    highEngagementBooks,
    isHighEngagementLoading,
    highEngagementError,
  } = useHighEngagementBooks(12);
  const { forYouBooks, isForYouLoading, forYouError } = useForYouBooks();
  const {
    booksByFollowedAuthors,
    isBooksByFollowedAuthorsLoading,
    booksByFollowedAuthorsError,
  } = useBooksByFollowedAuthors();
  const { discoverBooks, isDiscoverLoading, discoverError } = useDiscoverBooks(24);
  const { completedBooks, isCompletedLoading, completedError } = useCompletedBooks(20);

  const { searchResults, isSearchLoading, searchError } = useSearch(searchQuery);

  const isSearching = searchQuery.trim().length > 0;

  const statsBookIds = useMemo(() => {
    if (isSearching) {
      return [...new Set((searchResults ?? []).map((b) => b.id))];
    }
    const ids = new Set();
    (discoverBooks ?? []).forEach((b) => ids.add(b.id));
    (forYouBooks ?? []).forEach((b) => ids.add(b.id));
    (trendingBooks ?? []).forEach((b) => ids.add(b.id));
    (booksByFollowedAuthors ?? []).forEach((b) => ids.add(b.id));
    (completedBooks ?? []).forEach((b) => ids.add(b.id));
    return [...ids];
  }, [isSearching, discoverBooks, forYouBooks, trendingBooks, searchResults, booksByFollowedAuthors, completedBooks]);

  const { ratingsByBookId } = useRatingsByBookIds(statsBookIds);

  return {
    highEngagementBooks,
    isHighEngagementLoading,
    highEngagementError,
    trendingBooks,
    isTrendingLoading,
    trendingError,
    forYouBooks,
    isForYouLoading,
    forYouError,
    discoverBooks,
    isDiscoverLoading,
    discoverError,
    completedBooks,
    isCompletedLoading,
    completedError,
    ratingsByBookId,
    searchResults,
    isSearchLoading,
    searchError,
    isSearching,
    booksByFollowedAuthors,
    isBooksByFollowedAuthorsLoading,
    booksByFollowedAuthorsError,
  };
}