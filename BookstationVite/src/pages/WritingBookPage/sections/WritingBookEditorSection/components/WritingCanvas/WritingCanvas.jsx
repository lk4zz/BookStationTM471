import { EditorContent } from "@tiptap/react";
import styles from "./WritingCanvas.module.css";

function WritingCanvas({ editor, words, approxPages, saveStatus, chapterId}) {

  if (!chapterId) {
    return (
      <div className={styles.placeholder}>
        <p>Select or create a chapter to start writing.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.sheet}>
        {editor && <EditorContent editor={editor} className={styles.editorRoot} />}
      </div>

      {/* <footer className={styles.footer}>
        <span className={styles.hint}>
          ~{words} words · approx. {approxPages} page{approxPages !== 1 ? "s" : ""}{" "}
          (display only)
        </span>
        <span className={styles.saveState}>{saveStatus}</span>
      </footer> */}
    </div>
  );
}

export default WritingCanvas;