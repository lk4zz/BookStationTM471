import { useParams } from "react-router-dom";
import styles from "./ReadingPage.module.css";
import ReadingChaptersPanelSection from "./sections/ChaptersPanel/ReadingChaptersPanelSection";
import ReadingCanvasSection from "./sections/ReadingCanvasSection/ReadingCanvasSection";
import ReadingAiPanelSection from "./sections/AIPanel/ReadingAiPanelSection";
import { useReadingPage } from "./features/useReadingPage";

function ReadingPage() {
  const { bookId, chapterId } = useParams();
  const numericBookId = Number(bookId);
  const numericChapterId = Number(chapterId);

  const {
    chapters,
    chapter,
    isChapterLoading,
    isBootLoading,
    isContentLoading,
    isPagesLoading,
    firstPage,
    currentUser,
  } = useReadingPage(numericBookId, numericChapterId);

  return (
    <div className={styles.readingPage}>
      <ReadingChaptersPanelSection
        isBootLoading={isBootLoading}
        chapter={chapter}
        chapters={chapters}
        isChapterLoading={isChapterLoading}
      />

      <ReadingCanvasSection
        chapter={chapter}
        isContentLoading={isContentLoading}
        firstPage={firstPage}
        isPagesLoading={isPagesLoading}
      />

      <ReadingAiPanelSection
        chapterId={numericChapterId}
        currentUser={currentUser}
      />
    </div>
  );
}

export default ReadingPage;
