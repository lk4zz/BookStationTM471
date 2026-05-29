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
import { qk } from "../queryKeys";

export const useEditBookDetails = (book, onError) => {
    const bookId = book?.id;
    const isCreateMode = bookId == null;
    const queryClient = useQueryClient();

    //  Refs & State Management
    const pendingCoverFileRef = useRef(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [coverPreview, setCoverPreview] = useState(null);
    const [selectedGenres, setSelectedGenres] = useState([]);

    const { genres } = useAllGenres();

    //Initialize / Reset State
    useEffect(() => {
        setTitle(book?.name ?? "");
        setDescription(book?.description ?? "");
        setSelectedGenres((book?.bookGenres ?? []).map((bg) => bg.genreId ?? bg.bookGenre?.id));
        
        if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
        setCoverPreview(null);
        pendingCoverFileRef.current = null;
    }, [book]);

    //  Mutations
    const { handleSubmit: handleCoverFileInput, isLoading: isCoverLoadingEdit } = useEditBookCover(book);
    const createBookMutation = useCreateBook();
    const updateBookMutation = useUpdateBook();
    const tagBookMutation = useTagBook();

    const postCreateCoverMutation = useMutation({
        mutationFn: ({ imageFile, id }) => updateBookCover(imageFile, id),
        onSuccess: (_, { id }) => queryClient.invalidateQueries({ queryKey: qk.books.detail(id) }),
    });

    //  Derived Loading States
    const isCoverLoading = isCoverLoadingEdit || postCreateCoverMutation.isPending;
    
    // Check if ANY mutation is currently pending
    const isSaving = [
        createBookMutation, updateBookMutation, tagBookMutation, postCreateCoverMutation
    ].some(mutation => mutation.isPending);

    // Input Handlers
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

    //Unified Async Save Logic
    const handleSave = async (onComplete) => {
        if (!title.trim()) {
            return onError?.("Title is required.");
        }

        try {
            if (isCreateMode) {
                // --- CREATE FLOW ---
                const data = await createBookMutation.mutateAsync({
                    title: title.trim(),
                    description: description.trim(),
                });

                const newId = data?.book?.id ?? data?.id;
                if (!newId) throw new Error("Failed to retrieve new book ID.");

                const promises = [];
                
                if (selectedGenres.length > 0) {
                    promises.push(tagBookMutation.mutateAsync({ bookId: newId, genreIds: selectedGenres }));
                }
                
                if (pendingCoverFileRef.current) {
                    promises.push(postCreateCoverMutation.mutateAsync({ imageFile: pendingCoverFileRef.current, id: newId }));
                    pendingCoverFileRef.current = null;
                }

                // Wait for tags and cover to upload concurrently
                await Promise.all(promises);

            } else {
                // --- EDIT FLOW ---
                const currentGenreIds = (book?.bookGenres ?? []).map((bg) => bg.genreId ?? bg.bookGenre?.id);
                const titleChanged = title.trim() !== (book?.name ?? "");
                const descChanged = description.trim() !== (book?.description ?? "");
                const genresChanged = JSON.stringify([...selectedGenres].sort()) !== JSON.stringify([...currentGenreIds].sort());

                const promises = [];

                if (titleChanged || descChanged) {
                    promises.push(updateBookMutation.mutateAsync({ bookId, title: title.trim(), description: description.trim() }));
                }
                
                if (genresChanged && selectedGenres.length > 0) {
                    promises.push(tagBookMutation.mutateAsync({ bookId, genreIds: selectedGenres }));
                }

                // Wait for updates to fire concurrently
                await Promise.all(promises);
            }

            // If we reach here, everything succeeded
            onComplete?.();

        } catch (err) {
            // Centralized error handling
            onError?.(err?.message || "An error occurred while saving.");
        }
    };

    return {
        title, setTitle, description, setDescription, coverPreview, isCoverLoading,
        genres, selectedGenres, isSaving, handleCoverChange, toggleGenre, handleSave, isCreateMode,
    };
};