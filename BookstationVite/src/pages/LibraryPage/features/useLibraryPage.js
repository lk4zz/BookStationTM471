import { useMemo, useState } from "react";
import { useLibraryBooks, useRemoveFromLibrary } from "../../../hooks/useLibrary";
import { useProgressForBookIds } from "../../../hooks/useProgress";
import { useAllGenres } from "../../../hooks/useGenres";

function bookGenreIds(book) {
  return (book?.bookGenres ?? [])
    .map((bg) => bg.genreId ?? bg.bookGenre?.id)
    .filter(Boolean);
}

export function useLibraryPage() {
  const isGuest = !localStorage.getItem("token");
  const { data: libraryItems, isLoading, isError, error } = useLibraryBooks();
  const removeMutation = useRemoveFromLibrary();
  const { genres } = useAllGenres();

  const [genreFilter, setGenreFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title");

  const bookIds = useMemo(
    () => (libraryItems ?? []).map((item) => item.book?.id).filter(Boolean),
    [libraryItems]
  );
  const { progressByBookId, isProgressLoading } = useProgressForBookIds(bookIds);

  const filteredSorted = useMemo(() => {
    const items = libraryItems ?? [];
    let next = [...items];

    if (genreFilter !== "all") {
      const gid = Number(genreFilter);
      next = next.filter((item) => bookGenreIds(item.book).includes(gid));
    }

    const hasProg = (bookId) => Boolean(progressByBookId[bookId]?.lastChapterId);

    next.sort((a, b) => {
      const ba = a.book;
      const bb = b.book;
      if (sortBy === "progressDesc") {
        return (
          Number(hasProg(bb.id)) - Number(hasProg(ba.id)) ||
          (ba.name || "").localeCompare(bb.name || "")
        );
      }
      if (sortBy === "progressAsc") {
        return (
          Number(hasProg(ba.id)) - Number(hasProg(bb.id)) ||
          (ba.name || "").localeCompare(bb.name || "")
        );
      }
      return (ba.name || "").localeCompare(bb.name || "");
    });

    return next;
  }, [libraryItems, genreFilter, sortBy, progressByBookId]);

  return {
    isGuest,
    libraryItems,
    isLoading,
    isError,
    error,
    removeMutation,
    genres,
    genreFilter,
    setGenreFilter,
    sortBy,
    setSortBy,
    filteredSorted,
    progressByBookId,
    isProgressLoading,
  };
}
