import React from "react";
import styles from "./WritingToolbar.module.css";

export default function WritingToolbar({ editor }) {
  // if the editor hasn't loaded yet, don't show the toolbar
  if (!editor) {
    return null;
  }

  return (
    <div className={styles.toolbar}>
        

      {/* editor.chain().focus().toggleBold().run() is the Tiptap command to make text bold.
        editor.isActive("bold") checks if the cursor is currently on bold text so we can highlight the button.
      */}

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? styles.activeButton : styles.button}
      >
        Bold
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? styles.activeButton : styles.button}
      >
        Italic
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? styles.activeButton : styles.button}
      >
        Underline
      </button>

      <div className={styles.divider}></div>

      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={editor.isActive({ textAlign: "left" }) ? styles.activeButton : styles.button}
      >
        Left
      </button>
      
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={editor.isActive({ textAlign: "center" }) ? styles.activeButton : styles.button}
      >
        Center
      </button>
      
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={editor.isActive({ textAlign: "right" }) ? styles.activeButton : styles.button}
      >
        Right
      </button>
    </div>
  );
}