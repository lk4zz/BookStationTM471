import WritingToolbar from "./components/WritingToolBar/WritingToolbar";
import WritingCanvas from "./components/WritingCanvas/WritingCanvas";
import styles from "./WritingBookEditorSection.module.css";

function WritingBookEditorSection({
  editor,
  onEditBook,
  words,
  approxPages,
  saveStatus,
  chapterId,
}) {
  return (
    <section className={styles.middleSection}>
      <div className={styles.aboveCanvas}>
        <WritingToolbar editor={editor} onEditBook={onEditBook} />
      </div>
      <div className={styles.canvasContainer}>
        <WritingCanvas
          editor={editor}
          words={words}
          approxPages={approxPages}
          saveStatus={saveStatus}
          chapterId={chapterId}
        />
      </div>
    </section>
  );
}

export default WritingBookEditorSection;
