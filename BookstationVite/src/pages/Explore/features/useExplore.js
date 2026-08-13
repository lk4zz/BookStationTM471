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

import { bookMatchesSearch } from "../../../utils/fuzzyNameSearch"; 

export function useExplore(searchQuery = "") {
  const { trendingBooks, isTrendingLoading, trendingError } = useTrendingBooks(10);
  const { highEngagementBooks, isHighEngagementLoading, highEngagementError } = useHighEngagementBooks(12);
  const { forYouBooks, isForYouLoading, forYouError } = useForYouBooks();
  const { booksByFollowedAuthors, isBooksByFollowedAuthorsLoading, booksByFollowedAuthorsError } = useBooksByFollowedAuthors();
  const { discoverBooks, isDiscoverLoading, discoverError } = useDiscoverBooks(24);
  const { completedBooks, isCompletedLoading, completedError } = useCompletedBooks(20);

  // Alias the results from the API hook so we can override them
  const { searchResults: apiSearchResults, isSearchLoading, searchError } = useSearch(searchQuery);
  const isSearching = searchQuery.trim().length > 0;

  // --- FALLBACK LOGIC START ---

  // 1. Pool all locally fetched books together, deduplicated by ID
  const allLocalBooks = useMemo(() => {
    const bookMap = new Map();
    
    const addBooks = (books) => {
      if (!books) return;
      books.forEach((b) => {
        if (!bookMap.has(b.id)) bookMap.set(b.id, b);
      });
    };

    addBooks(trendingBooks);
    addBooks(highEngagementBooks);
    addBooks(forYouBooks);
    addBooks(booksByFollowedAuthors);
    addBooks(discoverBooks);
    addBooks(completedBooks);

    return Array.from(bookMap.values());
  }, [
    trendingBooks, 
    highEngagementBooks, 
    forYouBooks, 
    booksByFollowedAuthors, 
    discoverBooks, 
    completedBooks
  ]);

  // 2. Determine final search results (API vs Fuzzy Fallback)
  const finalSearchResults = useMemo(() => {
    if (!isSearching) return null;

    // If API returned valid results, always prioritize those
    if (apiSearchResults && apiSearchResults.length > 0) {
      return apiSearchResults;
    }

    // If API is done loading and we have no results (or if there's an error), run the fuzzy fallback
    if (!isSearchLoading) {
      return allLocalBooks.filter((book) => bookMatchesSearch(book, searchQuery));
    }

    // Otherwise, just return the empty/null API state while it's still loading
    return apiSearchResults;
  }, [isSearching, apiSearchResults, isSearchLoading, allLocalBooks, searchQuery]);

  // --- FALLBACK LOGIC END ---

  const statsBookIds = useMemo(() => {
    if (isSearching) {
      // Use our finalSearchResults here so ratings fetch for the fallback items too
      return [...new Set((finalSearchResults ?? []).map((b) => b.id))];
    }
    const ids = new Set();
    (discoverBooks ?? []).forEach((b) => ids.add(b.id));
    (forYouBooks ?? []).forEach((b) => ids.add(b.id));
    (trendingBooks ?? []).forEach((b) => ids.add(b.id));
    (booksByFollowedAuthors ?? []).forEach((b) => ids.add(b.id));
    (completedBooks ?? []).forEach((b) => ids.add(b.id));
    return [...ids];
  }, [isSearching, discoverBooks, forYouBooks, trendingBooks, finalSearchResults, booksByFollowedAuthors, completedBooks]);

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
    
    // Export the resolved results instead of the raw API results
    searchResults: finalSearchResults, 
    isSearchLoading,
    
    // Optional: Hide the search error from the UI if the fuzzy search actually found something
    searchError: finalSearchResults?.length > 0 ? null : searchError, 
    isSearching,
    booksByFollowedAuthors,
    isBooksByFollowedAuthorsLoading,
    booksByFollowedAuthorsError,
  };
}