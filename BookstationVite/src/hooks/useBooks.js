import {
    getBookById, getAllBooks, getBooksByGenre, getBooksByAuthor,
    createBook, deleteBook, updateBookStatus, getTrendingBooks, getForYouBooks, updateBookCover,
    launchBook, updateBook, tagBook, getBooksByFollowedAuthors,
} from "../api/books";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { useAllGenres } from "./useGenres";

const BOOK_QUERY_KEY = (bookId) => ["book", bookId, true];

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
    const isPersonalized =
      forYouData?.isPersonalized ??
      forYouBooks.some((b) => typeof b?.similarityScore === "number");

    return { forYouBooks, isForYouLoading, forYouError, isPersonalized };
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

export const useEditBookDetails = (book, onError) => {
    const bookId = book?.id;
    const isCreateMode = bookId == null;

    const pendingCoverFileRef = useRef(null);
    const queryClient = useQueryClient();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [coverPreview, setCoverPreview] = useState(null);
    const [selectedGenres, setSelectedGenres] = useState([]);

    const extractGenreIds = (b) =>
        (b?.bookGenres ?? []).map((bg) => bg.genreId ?? bg.bookGenre?.id);

    useEffect(() => {
        if (book) {
            setTitle(book.name ?? "");
            setDescription(book.description ?? "");
            setSelectedGenres(extractGenreIds(book));
            setCoverPreview(null);
            pendingCoverFileRef.current = null;
        } else {
            setTitle("");
            setDescription("");
            setSelectedGenres([]);
            setCoverPreview(null);
            pendingCoverFileRef.current = null;
        }
    }, [book]);

    const { genres } = useAllGenres();

    const { handleSubmit: handleCoverFileInput, isLoading: isCoverLoadingEdit } =
        useEditBookCover(book);

    const createBookMutation = useCreateBook();
    const updateBookMutation = useUpdateBook();
    const tagBookMutation = useTagBook();

    const postCreateCoverMutation = useMutation({
        mutationFn: ({ imageFile, id }) => updateBookCover(imageFile, id),
        onSuccess: async (_, { id }) => {
            await queryClient.refetchQueries({ queryKey: BOOK_QUERY_KEY(id) });
        },
    });

    const isCoverLoading =
        isCoverLoadingEdit ||
        postCreateCoverMutation.isPending;

    const isSaving =
        updateBookMutation.isPending ||
        tagBookMutation.isPending ||
        createBookMutation.isPending ||
        postCreateCoverMutation.isPending;

    const handleCoverChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
        setCoverPreview(URL.createObjectURL(file));
        if (isCreateMode) {
            pendingCoverFileRef.current = file;
        } else {
            handleCoverFileInput(e);
        }
    };

    const toggleGenre = (genreId) => {
        setSelectedGenres((prev) =>
            prev.includes(genreId) ? prev.filter((g) => g !== genreId) : [...prev, genreId]
        );
    };

    const handleCreateSave = (onComplete) => {
        if (!title.trim()) {
            onError?.("Title is required.");
            return;
        }
        createBookMutation.mutate(
            { title: title.trim(), description: description.trim() },
            {
                onSuccess: (data) => {
                    const payload = data?.book ?? data;
                    const newId = payload?.id;
                    onComplete?.();
                    if (!newId) return;
                    if (selectedGenres.length > 0) {
                        tagBookMutation.mutate(
                            { bookId: newId, genreIds: selectedGenres },
                            {
                                onError: (err) =>
                                    onError?.(err?.message || "Could not tag book."),
                            }
                        );
                    }
                    if (pendingCoverFileRef.current) {
                        const file = pendingCoverFileRef.current;
                        pendingCoverFileRef.current = null;
                        postCreateCoverMutation.mutate(
                            { imageFile: file, id: newId },
                            {
                                onError: (err) =>
                                    onError?.(err?.message || "Could not upload cover."),
                            }
                        );
                    }
                },
                onError: (err) => {
                    onError?.(err?.message || "Could not create book.");
                },
            }
        );
    };

    const handleEditSave = (onComplete) => {
        const currentGenreIds = extractGenreIds(book);
        const titleChanged = title.trim() !== (book.name ?? "");
        const descChanged = description.trim() !== (book.description ?? "");
        const genresChanged =
            JSON.stringify([...selectedGenres].sort()) !==
            JSON.stringify([...currentGenreIds].sort());

        const runUpdate = titleChanged || descChanged;
        const runTag = genresChanged && selectedGenres.length > 0;

        if (!runUpdate && !runTag) {
            onComplete?.();
            return;
        }

        let pending = 0;
        const done = () => {
            pending -= 1;
            if (pending === 0) onComplete?.();
        };

        if (runUpdate) pending += 1;
        if (runTag) pending += 1;

        if (runUpdate) {
            updateBookMutation.mutate(
                { bookId, title: title.trim(), description: description.trim() },
                {
                    onSuccess: () => done(),
                    onError: (err) => {
                        onError?.(err?.message || "Could not update book.");
                        done();
                    },
                }
            );
        }
        if (runTag) {
            tagBookMutation.mutate(
                { bookId, genreIds: selectedGenres },
                {
                    onSuccess: () => done(),
                    onError: (err) => {
                        onError?.(err?.message || "Could not tag book.");
                        done();
                    },
                }
            );
        }
    };

    const handleSave = (onComplete) => {
        if (isCreateMode) {
            handleCreateSave(onComplete);
        } else {
            handleEditSave(onComplete);
        }
    };

    return {
        title,
        setTitle,
        description,
        setDescription,
        coverPreview,
        isCoverLoading,
        genres,
        selectedGenres,
        isSaving,
        handleCoverChange,
        toggleGenre,
        handleSave,
        isCreateMode,
    };
};

export const useBooksByFollowedAuthors = () => {
    const {
        data: booksByFollowedAuthorsData,
        isLoading: isBooksByFollowedAuthorsLoading,
        error: booksByFollowedAuthorsError,
    } = useQuery({
        queryKey: ["books", "followed-authors"],
        queryFn: getBooksByFollowedAuthors,
    });

    const booksByFollowedAuthors =
        booksByFollowedAuthorsData?.books ??
        booksByFollowedAuthorsData?.data ??
        [];

    return {
        booksByFollowedAuthors,
        isBooksByFollowedAuthorsLoading,
        booksByFollowedAuthorsError,
    };

}
