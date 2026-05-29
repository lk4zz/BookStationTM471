import { useNavigate } from "react-router-dom";
import { useGetProgress } from "../../hooks/useProgress";
import { useChaptersByBook } from "../../hooks/useChapters/useChaptersForUser";
import { checkIfGuest } from "../../utils/checkIfGuest";
import styles from "./ContinueReadingBtn.module.css";

//continue reading button that checks the reading progress to know where to navigate
export default function ContinueReadingBtn({ bookId, readState, className = "" }) {
  const navigate = useNavigate();

  const isGuest = checkIfGuest();

  //fetch the progress
  const { progress, isProgressLoading } = useGetProgress(bookId);
  //fetch the chapters to navigate
  const { chapters, isChaptersLoading } = useChaptersByBook(bookId);

  //if the progress is in loading state
  const isDataLoading = isProgressLoading || isChaptersLoading;

  //on click function
  const handleReadClick = () => {
    if (progress?.lastChapterId) {
      //if there is progress navigate to last viewed chapter
      navigate(`/book/reading/${bookId}/${progress.lastChapterId}`, { state: readState });
    } else if (chapters && chapters.length > 0) {
      //if there is no progress go to chapter 1
      navigate(`/book/reading/${bookId}/${chapters[0].id}`, { state: readState });
    }
  };

  //button UI 
  return (
    <button
      className={`${styles.primaryBtn} ${className}`.trim()}
      onClick={handleReadClick}
      disabled={!isGuest && (isDataLoading)}
    >
      {isGuest ?
        "Read First chapter" :
        isDataLoading
          ? "Loading..."
          : progress
            ? "Continue Reading"
            : "Read First Chapter"}
    </button>
  );
}