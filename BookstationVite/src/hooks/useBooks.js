import {
    getBookById, getAllBooks, getBooksByGenre, getBooksByAuthor,
    createBook, deleteBook, updateBookStatus, getTrendingBooks, getForYouBooks, updateBookCover,
    launchBook,
} from "../api/books";
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

export const useForYouBooks = () => {
    const {
        data: forYouData,
        isLoading: isForYouLoading,
        error: forYouError,
    } = useQuery({
        queryKey: ["books", "for-you"],
        queryFn: getForYouBooks,
    });

    const forYouBooks = forYouData?.data ?? []; 

    return { forYouBooks, isForYouLoading, forYouError };
};

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

    return { booksByAuthor, isBooksByAuthorLoading, booksByAuthorError };
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


export const useLaunchBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ bookId, chapterPrices }) =>
            launchBook(bookId, chapterPrices),
        onSuccess: (_, { bookId }) => {
            queryClient.invalidateQueries({ queryKey: ["books", "author"] });
            queryClient.invalidateQueries({ queryKey: ["book", bookId] });
            queryClient.invalidateQueries({ queryKey: ["chapters", bookId] });
        },
    });
};

export const useEditBookCover = (book, onSuccess) => {
    const queryClient = useQueryClient();


    // populate form whenever the user data arrives or changes
 

    const mutation = useMutation({
        mutationFn: ({ imageFile}) =>
            updateBookCover(imageFile, book.id),

        onSuccess: async () => {
            //refresh quieries before exiting edit mode
            await queryClient.refetchQueries({ queryKey: BOOK_QUERY_KEY(book.id) });
            onSuccess?.(); //on success indicator (when everything succesully uploaded)
        },
    });


    const handleSubmit = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        e.preventDefault();
        mutation.mutate({ imageFile: file});
    };

    return {
        isLoading: mutation.isPending,
        error: mutation.error ?? null,
        handleSubmit,
    };
};


export const useTrendingBooks = (limit) => {
    const {
        data: trendingData,
        isLoading: isTrendingLoading,
        error: trendingError,
    } = useQuery({
        queryKey: ["books", "trending", limit],
        queryFn: () => getTrendingBooks(limit),
    });

    const trendingBooks = trendingData?.data ?? [];

    return { trendingBooks, isTrendingLoading, trendingError };
};