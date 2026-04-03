import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useBookForWriting, useUpdateBookStatus } from "../useBooks";
import { useChaptersForAuthor } from "../useChapters";
import { useAuthorPages } from "../useWritingPages";
import { useCreateChapter, useUpdateChapter, useDeleteChapter, usePublishChapter } from "../useChapters";
import { checkIfGuest } from "../../utils/checkIfGuest";
import { useSearchParams } from "react-router-dom";


export function useWritingBookPageData(numericBookId) { //takes ID

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [error, setError] = useState(null);

  // data and loadings and errors
  const { book, isLoading: bookLoading, error: bookError } = useBookForWriting(numericBookId);
  const { chapters, isLoading: chaptersLoading } = useChaptersForAuthor(numericBookId);
  const { pages, isLoading: pagesLoading } = useAuthorPages(selectedChapterId);

  // mutations
  const createChapter = useCreateChapter();
  const updateChapter = useUpdateChapter();
  const deleteChapter = useDeleteChapter();
  const publishChapter = usePublishChapter();
  const updateBookStatus = useUpdateBookStatus();

  // Redirect guests
  useEffect(() => {
    if (checkIfGuest()) navigate("/login", { replace: true });
  }, [navigate]);

  // Sync selected chapter with URL always make sure the chapter in url is selected
  useEffect(() => {
    if (!chapters?.length) {
      setSelectedChapterId(null);
      return;
    }
    const queryId = Number(searchParams.get("chapter")); //grab chapterId from params
    //check if it is valid
    const isValid = Number.isFinite(queryId) && chapters.some((c) => c.id === queryId);

    if (isValid) {
      setSelectedChapterId(queryId); //select the chapter if id is valid
    } else {
      const firstId = chapters[0].id;
      setSelectedChapterId(firstId); //incase it is not valid replace it with first chapter
      setSearchParams({ chapter: String(firstId) }, { replace: true });
    }
  }, [chapters, searchParams, setSearchParams]);



  const selectChapter = (id) => {
    setSelectedChapterId(id);
    //change the url params upoon selecting a chapter
    id ? setSearchParams({ chapter: String(id) }) : setSearchParams({});
  };


  const initialHtml = useMemo(
    () => pages?.[0]?.text ?? "<p></p>", //display text inside the stored page(content holder) in the chapter
    [pages, selectedChapterId]
  );

  console.log(initialHtml)


  const handleStatusChange = (e) => {
    setError(null);
    updateBookStatus.reset();
    updateBookStatus.mutate(
      { bookId: numericBookId, requestedStatus: e.target.value },
      {
        onError: (err) => setError(err?.message || "Could not update status."),
        onSuccess: () => setError(null),
      }
    );
  };

  const handleDeleteChapter = (inBook) => {
    setError(null);
    deleteChapter.reset();
    deleteChapter.mutate(inBook, {
      onError: (err) => setError(err?.message || "Could not delete chapter."),
      onSuccess: () => {
        setError(null);
        if (selectedChapterId === inBook.chapterId) {
          setSelectedChapterId(null);
          setSearchParams({}, { replace: true });
        }
      },
    });
  };

  const handleCreateChapter = (inBook) => {
    setError(null);
    createChapter.reset();
    createChapter.mutate(inBook, {
      onError: (err) => setError(err?.message || "Could not create chapter."),
      onSuccess: () => setError(null),
    });
  };

  const handleUpdateChapter = (inBook) => {
    setError(null);
    updateChapter.reset();
    updateChapter.mutate(inBook, {
      onError: (err) => setError(err?.message || "Could not update chapter."),
      onSuccess: () => setError(null),
    });
  };

  const handlePublishChapter = (inBook) => {
    setError(null);
    publishChapter.reset();
    publishChapter.mutate(inBook, {
      onError: (err) => setError(err?.message || "Could not publish chapter."),
      onSuccess: () => setError(null),
    });
  };

  //clear timer for error messages
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  const isBusy =
    createChapter.isPending ||
    updateChapter.isPending ||
    deleteChapter.isPending ||
    publishChapter.isPending;

  return {
    book, bookLoading, bookError,
    chapters, chaptersLoading,
    pages, pagesLoading,
    selectedChapterId, selectChapter,
    initialHtml,
    isBusy,
    handleStatusChange,
    handleDeleteChapter,
    onCreateChapter: handleCreateChapter,
    onUpdateChapter: handleUpdateChapter,
    onPublishChapter: handlePublishChapter,
    isStatusPending: updateBookStatus.isPending,
    error,
  };
}