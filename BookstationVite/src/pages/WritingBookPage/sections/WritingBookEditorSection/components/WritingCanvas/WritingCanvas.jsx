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
    </div>
  );
}

export default WritingCanvas;