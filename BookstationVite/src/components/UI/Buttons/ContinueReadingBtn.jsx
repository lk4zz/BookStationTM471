import { useNavigate } from "react-router-dom";
import { useGetProgress } from "../../../hooks/useProgress";
import { useChaptersByBook } from "../../../hooks/useChapters/useChaptersForUser";
import { checkIfGuest } from "../../../utils/checkIfGuest";
import styles from "./ContinueReadingBtn.module.css";

export default function ContinueReadingBtn({ bookId, readState, className = "" }) {
  const navigate = useNavigate();

  const isGuest = checkIfGuest();

  const { progress, isProgressLoading } = useGetProgress(bookId);
  const { chapters, isChaptersLoading } = useChaptersByBook(bookId);

  const isDataLoading = isProgressLoading || isChaptersLoading;

  const handleReadClick = () => {
    if (progress?.lastChapterId) {
      navigate(`/book/reading/${bookId}/${progress.lastChapterId}`, { state: readState });
    } else if (chapters && chapters.length > 0) {
      navigate(`/book/reading/${bookId}/${chapters[0].id}`, { state: readState });
    }
  };

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