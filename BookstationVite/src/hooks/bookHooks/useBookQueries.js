import { useQuery } from "@tanstack/react-query";
import {
    getBookById, 
    getAllBooks, 
    getForYouBooks, 
    getBooksByGenre, 
    getBooksByAuthor, 
    getTrendingBooks, 
    getHighEngagementBooks,
    getBooksByFollowedAuthors
} from "../../api/books"; 

export const useBookById = (numericId, includeAuth = false) => {
    const { data: bookData, isLoading: isBookLoading, error: bookError } = useQuery({
        queryKey: ["book", numericId, includeAuth],
        queryFn: () => getBookById(numericId, includeAuth),
        enabled: Number.isFinite(numericId),
    });
    const book = bookData?.data ?? bookData;
    return { book, isBookLoading, bookError };
}

export const useAllBooks = () => {
    const { data: booksData, isLoading: isBooksLoading, error: booksError } = useQuery({
        queryKey: ["books"],
        queryFn: getAllBooks,
    });
    const books = booksData?.data ?? booksData ?? [];
    return { books, isBooksLoading, booksError };
}

export const useForYouBooks = () => {
    const { data: forYouData, isLoading: isForYouLoading, error: forYouError } = useQuery({
        queryKey: ["books", "for-you"],
        queryFn: getForYouBooks,
    });
    const forYouBooks = forYouData?.data ?? [];
    const isPersonalized = forYouData?.isPersonalized ?? forYouBooks.some((b) => typeof b?.similarityScore === "number");
    return { forYouBooks, isForYouLoading, forYouError, isPersonalized };
};

export const useBooksByGenre = (genreId) => {
    const { data: booksData, isLoading: isBooksLoading, error: booksError } = useQuery({
        queryKey: ["books", "genre", genreId],
        queryFn: () => getBooksByGenre(genreId),
        enabled: !!genreId
    });
    const books = booksData?.data ?? [];
    return { books, isBooksLoading, booksError };
}

export const useBooksByAuthor = (userId) => {
    const { data: booksByAuthorData, isLoading: isBooksByAuthorLoading, error: booksByAuthorError } = useQuery({
        queryKey: ["books", "author", userId],
        queryFn: () => getBooksByAuthor(userId),
        enabled: !!userId
    });
    const booksByAuthor = booksByAuthorData?.data ?? booksByAuthorData;
    return { booksByAuthor, isBooksByAuthorLoading, booksByAuthorError };
}

export const useTrendingBooks = (limit) => {
    const { data: trendingData, isLoading: isTrendingLoading, error: trendingError } = useQuery({
        queryKey: ["books", "trending", limit],
        queryFn: () => getTrendingBooks(limit),
    });
    const trendingBooks = trendingData?.data ?? [];
    return { trendingBooks, isTrendingLoading, trendingError };
};

export const useHighEngagementBooks = (limit) => {
    const { data: highEngagementData, isLoading: isHighEngagementLoading, error: highEngagementError } = useQuery({
        queryKey: ["books", "high-engagement", limit],
        queryFn: () => getHighEngagementBooks(limit),
    });
    const highEngagementBooks = highEngagementData?.data ?? [];
    return { highEngagementBooks, isHighEngagementLoading, highEngagementError };
};

export const useBooksByFollowedAuthors = () => {
    const { data: booksByFollowedAuthorsData, isLoading: isBooksByFollowedAuthorsLoading, error: booksByFollowedAuthorsError } = useQuery({
        queryKey: ["books", "followed-authors"],
        queryFn: getBooksByFollowedAuthors,
    });
    const booksByFollowedAuthors = booksByFollowedAuthorsData?.books ?? booksByFollowedAuthorsData?.data ?? [];
    return { booksByFollowedAuthors, isBooksByFollowedAuthorsLoading, booksByFollowedAuthorsError };
}