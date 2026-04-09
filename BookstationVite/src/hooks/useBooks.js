import { getBookById, getAllBooks, getBooksByGenre, getBooksByAuthor,
    createBook, deleteBook, updateBookStatus, } from "../api/books";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useBookById = (numericId, includeAuth = false) => {

    const {
        data: bookData,
        isLoading: isBookLoading,
        error: bookError,
    } = useQuery({
        queryKey: ["book", numericId, includeAuth],
        queryFn: () => getBookById(numericId, includeAuth),
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

export const useBooksByAuthor = (userId) => { //all books made by author
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

export const useCreateBook = () => {  //this creates book
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBook,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["books", "author"] });
        },
    });
};

export const useDeleteBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteBook,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["books", "author"] });
        },
    });
};

export const useUpdateBookStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ bookId, requestedStatus }) =>
            updateBookStatus(bookId, requestedStatus),
        onSuccess: (_, { bookId }) => {
            queryClient.invalidateQueries({ queryKey: ["books", "author"] });
            queryClient.invalidateQueries({ queryKey: ["book", bookId] });
        },
    });
};