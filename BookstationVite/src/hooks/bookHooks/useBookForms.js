import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBookCover } from "../../api/books";
import { useAllGenres } from "../useGenres";
import {
    useCreateBook,
    useEditBookCover,
    useTagBook,
    useUpdateBook,
} from "./useBookMutations";

const BOOK_QUERY_KEY = (bookId) => ["book", bookId, true];

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