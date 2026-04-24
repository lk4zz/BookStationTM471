import { useState } from "react";
import { EditorContent } from "@tiptap/react";
import styles from "./WritingCanvas.module.css";

function WritingCanvas({ editor, words, approxPages, saveStatus, chapterId, cannotEdit }) {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  if (!chapterId) {
    return (
      <div className={styles.placeholder}>
        <p>Select or create a chapter to start writing.</p>
      </div>
    );
  }

  const handleMouseMove = (e) => {
    if (!cannotEdit) return;
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className={styles.wrap}>
      <div 
        className={styles.sheet}
        onMouseEnter={() => cannotEdit && setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        {editor && <EditorContent editor={editor}
          className={`${styles.editorRoot} ${cannotEdit ? styles.cannotEdit : ""}`}
        />}
      </div>

      {/* The Tooltip: Static styles in CSS, dynamic positioning inline */}
      {isHovering && cannotEdit && (
        <div 
          className={styles.tooltip}
          style={{
            top: mousePos.y + 15, 
            left: mousePos.x + 15
          }}
        >
          Published chapter cannot be edited!.
        </div>
      )}

      <p>{saveStatus} {words} words. {approxPages} pages.</p>
    </div>
  );
}

export default WritingCanvas;