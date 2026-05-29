import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitForReview } from "../../api/books"; // Update imports
import {
    createBook,
    deleteBook,
    updateBookStatus,
    launchBook,
    updateBook,
    tagBook,
    updateBookCover
} from "../../api/books";
import { qk } from "../queryKeys";

//create book
export const useCreateBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBook,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: qk.books.byAuthor().slice(0, 2) });
        },
    });
};

//delete book
export const useDeleteBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteBook,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: qk.books.byAuthor().slice(0, 2) });
        },
    });
};

//update book status (DRAFT COMPELTELD OR ONGOING)
export const useUpdateBookStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ bookId, requestedStatus }) =>
            updateBookStatus(bookId, requestedStatus),
        onSuccess: (_, { bookId }) => {
            queryClient.invalidateQueries({ queryKey: qk.books.byAuthor().slice(0, 2) });
            queryClient.invalidateQueries({ queryKey: qk.books.detail(bookId) });
        },
    });
};

//launch book (upload first three chapters and set to ongoing state)
export const useLaunchBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ bookId, chapterPrices }) =>
            launchBook(bookId, chapterPrices),
        onSuccess: (_, { bookId }) => {
            queryClient.invalidateQueries({ queryKey: qk.books.byAuthor().slice(0, 2) });
            queryClient.invalidateQueries({ queryKey: qk.books.detail(bookId) });
            queryClient.invalidateQueries({ queryKey: qk.chapters.byBook(bookId) });
        },
    });
};

//update book details
export const useUpdateBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ bookId, title, description }) =>
            updateBook(bookId, { title, description }),
        onSuccess: (_, { bookId }) => {
            queryClient.invalidateQueries({ queryKey: qk.books.byAuthor().slice(0, 2) });
            queryClient.invalidateQueries({ queryKey: qk.books.detail(bookId) });
        },
    });
};

//edit book cover
export const useEditBookCover = (book) => {
    const bookId = book?.id;
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ imageFile }) =>
            updateBookCover(imageFile, bookId),
        onSuccess: async () => {
            if (bookId != null) {
                await queryClient.refetchQueries({ queryKey: qk.books.detail(bookId) });
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

//tag book with genre
export const useTagBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ bookId, genreIds }) => tagBook(bookId, genreIds),
        onSuccess: (_, { bookId }) => {
            queryClient.invalidateQueries({ queryKey: qk.books.detail(bookId) });
        },
    });
};

//submit for review
export const useSubmitForReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: submitForReview,
        onSuccess: (_, variables) => {
            const bookId = variables?.bookId;
            queryClient.invalidateQueries({ queryKey: qk.books.byAuthor().slice(0, 2) });
            queryClient.invalidateQueries({ queryKey: qk.books.detail(bookId) });
        },
    });
};