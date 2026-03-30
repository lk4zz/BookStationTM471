import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useBookForWriting, useUpdateBookStatus } from "../useBooks";
import { useChaptersForAuthor } from "../useChapters";
import { usePagesByChatper } from "../usePages";
import { useCreateChapter, useUpdateChapter, useDeleteChapter, usePublishChapter } from "../useChapters";
import { checkIfGuest } from "../../utils/checkIfGuest";
import { useSearchParams } from "react-router-dom";


export function useWritingBookPageData(numericBookId) { //takes ID

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [statusError, setStatusError] = useState(null);

  // data and loadings and errors
  const { book, isLoading: bookLoading, error: bookError } = useBookForWriting(numericBookId);
  const { chapters, isLoading: chaptersLoading } = useChaptersForAuthor(numericBookId);
  const { pages, isLoading: pagesLoading } = usePagesByChatper(selectedChapterId);

  // mutations
  const createChapter  = useCreateChapter();
  const updateChapter  = useUpdateChapter();
  const deleteChapter  = useDeleteChapter();
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
    () => pages?.[0]?.text ?? "<p></p>",
    [pages, selectedChapterId]
  );

  const handleStatusChange = (e) => {
    setStatusError(null);
    updateBookStatus.mutate(
      { bookId: numericBookId, requestedStatus: e.target.value },
      { onError: (err) => setStatusError(err.message ?? "Could not update status.") }
    );
  };

  const handleDeleteChapter = (inBook) => {
    deleteChapter.mutate(inBook, {
      onSuccess: () => {
        if (selectedChapterId === inBook.chapterId) {
          setSelectedChapterId(null);
          setSearchParams({}, { replace: true });
        }
      },
    });
  };

  const isBusy =
    createChapter.isPending  ||
    updateChapter.isPending  ||
    deleteChapter.isPending  ||
    publishChapter.isPending;

  return {
    book, bookLoading, bookError,
    chapters, chaptersLoading,
    pages, pagesLoading,
    selectedChapterId, selectChapter,
    initialHtml,
    statusError,
    isBusy,
    handleStatusChange,
    handleDeleteChapter,
    onCreateChapter: (inBook) => createChapter.mutate(inBook),
    onUpdateChapter: (inBook) => updateChapter.mutate(inBook),
    onPublishChapter: (inBook) => publishChapter.mutate(inBook),
    isStatusPending: updateBookStatus.isPending,
  };
}