import { useQuery } from "@tanstack/react-query";
import {
    getBookById, 
    getAllBooks, 
    getForYouBooks, 
    getBooksByGenre, 
    getBooksByAuthor, 
    getTrendingBooks, 
    getHighEngagementBooks,
    getBooksByFollowedAuthors,
    getDiscoverBooks,
    getCompletedBooks,
} from "../../api/books"; 
import { qk } from "../queryKeys";

// --- queries ---

//fetch book by id
export const useBookById = (numericId, includeAuth = false) => {
    const { data: bookData, isLoading: isBookLoading, error: bookError } = useQuery({
        queryKey: qk.books.detail(numericId),
        queryFn: () => getBookById(numericId, includeAuth),
        enabled: Number.isFinite(numericId),
    });
    const book = bookData?.data ?? bookData;
    return { book, isBookLoading, bookError };
}

//fetch all books
export const useAllBooks = () => {
    const { data: booksData, isLoading: isBooksLoading, error: booksError } = useQuery({
        queryKey: qk.books.all(),
        queryFn: getAllBooks,
    });
    const books = booksData?.data ?? booksData ?? [];
    return { books, isBooksLoading, booksError };
}

//fetch for you book recommendations
export const useForYouBooks = () => {
    const { data: forYouData, isLoading: isForYouLoading, error: forYouError } = useQuery({
        queryKey: qk.books.forYou(),
        queryFn: getForYouBooks,
    });
    const forYouBooks = forYouData?.data ?? [];
    const isPersonalized = forYouData?.isPersonalized ?? forYouBooks.some((b) => typeof b?.similarityScore === "number");
    return { forYouBooks, isForYouLoading, forYouError, isPersonalized };
};

//fetch books by genre
export const useBooksByGenre = (genreId) => {
    const { data: booksData, isLoading: isBooksLoading, error: booksError } = useQuery({
        queryKey: qk.books.byGenre(genreId),
        queryFn: () => getBooksByGenre(genreId),
        enabled: !!genreId
    });
    const books = booksData?.data ?? [];
    return { books, isBooksLoading, booksError };
}

//fetch books by author
export const useBooksByAuthor = (userId) => {
    const { data: booksByAuthorData, isLoading: isBooksByAuthorLoading, error: booksByAuthorError } = useQuery({
        queryKey: qk.books.byAuthor(userId),
        queryFn: () => getBooksByAuthor(userId),
        enabled: !!userId
    });
    const booksByAuthor = booksByAuthorData?.data ?? booksByAuthorData;
    return { booksByAuthor, isBooksByAuthorLoading, booksByAuthorError };
}

// fetch trending books
export const useTrendingBooks = (limit) => {
    const { data: trendingData, isLoading: isTrendingLoading, error: trendingError } = useQuery({
        queryKey: qk.books.trending(limit),
        queryFn: () => getTrendingBooks(limit),
    });
    const trendingBooks = trendingData?.data ?? [];
    return { trendingBooks, isTrendingLoading, trendingError };
};

// fetch high engagement books
export const useHighEngagementBooks = (limit) => {
    const { data: highEngagementData, isLoading: isHighEngagementLoading, error: highEngagementError } = useQuery({
        queryKey: qk.books.highEngagement(limit),
        queryFn: () => getHighEngagementBooks(limit),
    });
    const highEngagementBooks = highEngagementData?.data ?? [];
    return { highEngagementBooks, isHighEngagementLoading, highEngagementError };
};

// fetch books by followed authors
export const useBooksByFollowedAuthors = () => {
    const { data: booksByFollowedAuthorsData, isLoading: isBooksByFollowedAuthorsLoading, error: booksByFollowedAuthorsError } = useQuery({
        queryKey: qk.books.followedAuthors(),
        queryFn: getBooksByFollowedAuthors,
    });
    const booksByFollowedAuthors = booksByFollowedAuthorsData?.books ?? booksByFollowedAuthorsData?.data ?? [];
    return { booksByFollowedAuthors, isBooksByFollowedAuthorsLoading, booksByFollowedAuthorsError };
}

// fetch discover books
export const useDiscoverBooks = (limit = 24) => {
    const { data, isLoading: isDiscoverLoading, error: discoverError } = useQuery({
        queryKey: qk.books.discover(limit),
        queryFn: () => getDiscoverBooks({ limit }),
    });
    const discoverBooks = data?.data ?? [];
    return { discoverBooks, isDiscoverLoading, discoverError };
};

// fetch completed books
export const useCompletedBooks = (limit = 20) => {
    const { data, isLoading: isCompletedLoading, error: completedError } = useQuery({
        queryKey: qk.books.completed(limit),
        queryFn: () => getCompletedBooks({ limit }),
    });
    const completedBooks = data?.data ?? [];
    return { completedBooks, isCompletedLoading, completedError };
};