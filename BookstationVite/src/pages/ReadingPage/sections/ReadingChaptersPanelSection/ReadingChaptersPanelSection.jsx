import ChaptersPanel from "./components/ChaptersPanel/ChaptersPanel";
import { Loading } from "../../../../components/UI/Loading/Loading";
import styles from "./ReadingChaptersPanelSection.module.css";

function ReadingChaptersPanelSection({
  isBootLoading,
  chapter,
  chapters,
  isChapterLoading,
}) {
  return (
    <section className={styles.chaptersPanelContainer}>
      {isBootLoading || !chapter ? (
        <div className={styles.panelPad}>
          <Loading variant="inline" />
        </div>
      ) : (
        <ChaptersPanel
          chapter={chapter}
          chapters={chapters}
          isChapterLoading={isChapterLoading}
        />
      )}
    </section>
  );
}

export default ReadingChaptersPanelSection;
