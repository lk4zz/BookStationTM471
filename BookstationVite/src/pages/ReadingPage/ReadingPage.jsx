import { useEffect } from "react";
import ChaptersPanel from "../../components/ReadingPageComp/ChaptersPanel/ChaptersPanel";
import ReadingCanvas from "../../components/ReadingPageComp/ReadingCanvas/ReadingCanvas";
import AiPanel from "../../components/ReadingPageComp/AiPanel/AiPanel";
import { useChapterById, useChaptersByBook } from "../../hooks/useChapters";
import { usePagesByChatper } from "../../hooks/usePages";
import { useParams } from "react-router-dom";
import styles from './ReadingPage.module.css'
import { useUpdateProgress } from "../../hooks/useProgress";


function ReadingPage() {
  const { bookId } = useParams();
  const { chapterId } = useParams();
  const numericBookId = Number(bookId);
  const numericChapterId = Number(chapterId);


  const { chapters, isChaptersLoading } = useChaptersByBook(numericBookId);
  const { chapterData, isChapterLoading } = useChapterById(numericChapterId)
  const { pagesData, isPagesLoading, pagesError } = usePagesByChatper(numericChapterId);

  const { saveProgress } = useUpdateProgress();
  useEffect(() => {
    if (numericBookId && numericChapterId) {
      saveProgress({ bookId: numericBookId, chapterId: numericChapterId });
    }
  }, [numericBookId, numericChapterId, saveProgress]);

  if (isPagesLoading) return <p>BRUH</p>
  if (isChaptersLoading) return <p className="loading">Loading..</p>
  if (isChapterLoading) return <p className="loading">Loading..</p>

  const { chapter, hasAccess } = chapterData
  const { pages, hasAccessPages } = pagesData


  return (
    <div className={styles.readingPage}>

      <section className={styles.chaptersPanelContainer}>
        <ChaptersPanel chapter={chapter} chapters={chapters} isChapterLoading={isChapterLoading} />
      </section>

      <section className={styles.middleSection} >
        <div className={styles.aboveCanvas}>
          <h1>{chapter.book.name}</h1>
        </div>
        <div className={styles.canvasContainer}>
          {pages?.map((page) => (
            <ReadingCanvas key={page.id} page={page} chapter={chapter} />
          ))}
        </div>
      </section>

      <section className={styles.AiPanelContainer}>
        <AiPanel />
      </section>

    </div>
  )
}

export default ReadingPage;