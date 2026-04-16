import { useParams } from "react-router-dom";
import styles from "./ReadingPage.module.css";
import ReadingChaptersPanelSection from "./sections/ReadingChaptersPanelSection/ReadingChaptersPanelSection";
import ReadingCanvasSection from "./sections/ReadingCanvasSection/ReadingCanvasSection";
import ReadingAiPanelSection from "./sections/ReadingAiPanelSection/ReadingAiPanelSection";
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

      <ReadingAiPanelSection chapterId={numericChapterId} />
    </div>
  );
}

export default ReadingPage;
