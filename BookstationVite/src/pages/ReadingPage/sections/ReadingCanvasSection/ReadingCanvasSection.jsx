import ReadingCanvas from "./components/ReadingCanvas/ReadingCanvas";
import { Loading } from "../../../../components/UI/Loading/Loading";
import styles from "./ReadingCanvasSection.module.css";

function ReadingCanvasSection({
  chapter,
  isContentLoading,
  firstPage,
  isPagesLoading,
}) {
  return (
    <section className={styles.middleSection}>
      <div className={styles.aboveCanvas}>
        <h1 className={styles.chapterTitle}>
          {chapter?.book?.name ?? "Loading…"}
        </h1>
      </div>
      <div className={styles.canvasContainer}>
        {isContentLoading ? (
          <div className={styles.canvasPad}>
            <Loading variant="inline" />
          </div>
        ) : (
          <ReadingCanvas
            key={firstPage.id}
            page={firstPage}
            chapter={chapter}
            isPagesLoading={isPagesLoading}
          />
        )}
      </div>
    </section>
  );
}

export default ReadingCanvasSection;
