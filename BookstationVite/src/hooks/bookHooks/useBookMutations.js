import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createBook, 
    deleteBook, 
    updateBookStatus, 
    launchBook, 
    updateBook, 
    tagBook, 
    updateBookCover
} from "../../api/books"; 

const BOOK_QUERY_KEY = (bookId) => ["book", bookId, true];

export const useCreateBook = () => {
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

export const useUpdateBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ bookId, title, description }) =>
            updateBook(bookId, { title, description }),
        onSuccess: (_, { bookId }) => {
            queryClient.invalidateQueries({ queryKey: ["books", "author"] });
            queryClient.invalidateQueries({ queryKey: BOOK_QUERY_KEY(bookId) });
        },
    });
};

export const useTagBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ bookId, genreIds }) => tagBook(bookId, genreIds),
        onSuccess: (_, { bookId }) => {
            queryClient.invalidateQueries({ queryKey: BOOK_QUERY_KEY(bookId) });
        },
    });
};

export const useEditBookCover = (book) => {
    const bookId = book?.id;
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ imageFile }) =>
            updateBookCover(imageFile, bookId),
        onSuccess: async () => {
            if (bookId != null) {
                await queryClient.refetchQueries({ queryKey: BOOK_QUERY_KEY(bookId) });
            }
        },
    });

    const handleSubmit = (e) => {
        const file = e.target.files?.[0];
        if (!file || bookId == null) return;
        mutation.mutate({ imageFile: file });
    };

    return {
        isLoading: mutation.isPending,
        error: mutation.error ?? null,
        handleSubmit,
    };
};