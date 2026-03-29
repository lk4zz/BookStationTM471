import { getBookById, getAllBooks, getBooksByGenre, getBooksByAuthor } from "../api/books";
import { useQuery } from "@tanstack/react-query";

export const useBookById = (numericId) => {

    const {
        data: bookData,
        isLoading: isBookLoading,
        error: bookError,
    } = useQuery({
        queryKey: ["book", numericId],
        queryFn: () => getBookById(numericId),
        enabled: Number.isFinite(numericId),
    });

    const book = bookData?.data ?? bookData;

    return { book, isBookLoading, bookError }

}

export const useAllBooks = () => {
    const {
        data: booksData,
        isLoading: isBooksLoading,
        error: booksError
    } = useQuery({
        queryKey: ["books"],
        queryFn: getAllBooks,
    });

    const books = booksData?.data ?? booksData ?? [];
    return { books, isBooksLoading, booksError };
}

export const useBooksByGenre = (genreId) => {
    const {
        data: booksData,
        isLoading: isBooksLoading,
        error: booksError
    } = useQuery({
        queryKey: ["books", "genre", genreId],
        queryFn: () => getBooksByGenre(genreId),
        enabled: !!genreId //important: hay prevents the query from running before checking for genreID so no books will load from other genres
    });
    const books = booksData?.data ?? [];
    return { books, isBooksLoading, booksError };
}

export const useBooksByAuthor = (userId) => {
    const {
        data: booksByAuthorData,
        isLoading: isBooksByAuthorLoading,
        error: booksByAuthorError,
    } = useQuery({
        queryKey: ["books", "author", userId],
        queryFn: () => getBooksByAuthor(userId),
        enabled: !!userId
    })
    const booksByAuthor = booksByAuthorData?.data ?? booksByAuthorData;
    return { booksByAuthor, isBooksByAuthorLoading, booksByAuthorError};
}