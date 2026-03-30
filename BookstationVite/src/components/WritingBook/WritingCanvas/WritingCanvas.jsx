import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useRef } from "react";
import { useUpsertPrimaryPage } from "../../../hooks/useWritingPages";
import styles from "./WritingCanvas.module.css";

const AUTOSAVE_MS = 2000;

function wordCountFromHtml(html) {
  if (typeof document === "undefined") return 0;
  const el = document.createElement("div");
  el.innerHTML = html;
  const text = el.textContent || "";
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function WritingCanvas({ chapterId, bookId, initialHtml, isLoading }) {
  const saveMutation = useUpsertPrimaryPage();
  const debounceRef = useRef(null);
  const lastSaved = useRef("");

  const runSave = useCallback(
    (html) => {
      if (html === lastSaved.current) return;
      lastSaved.current = html;
      saveMutation.mutate({ chapterId, text: html, bookId });
    },
    [chapterId, bookId, saveMutation],
  );

  const scheduleSave = useCallback(
    (html) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => runSave(html), AUTOSAVE_MS);
    },
    [runSave],
  );

  const editor = useEditor(
    {
      extensions: [StarterKit],
      content: "<p></p>",
      editorProps: {
        attributes: {
          class: styles.tiptapInner,
        },
      },
      onUpdate: ({ editor: ed }) => {
        scheduleSave(ed.getHTML());
      },
    },
    [chapterId],
  );

  useEffect(() => {
    if (!editor || isLoading) return;
    const html = initialHtml || "<p></p>";
    lastSaved.current = html;
    editor.commands.setContent(html, { emitUpdate: false });
  }, [chapterId, editor, isLoading, initialHtml]);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  const html = editor ? editor.getHTML() : "";
  const words = wordCountFromHtml(html);
  const approxPages = Math.max(1, Math.ceil(words / 250));

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
      <footer className={styles.footer}>
        <span className={styles.hint}>
          ~{words} words · approx. {approxPages} page{approxPages !== 1 ? "s" : ""}{" "}
          (display only)
        </span>
        <span className={styles.saveState}>
          {saveMutation.isPending
            ? "Saving…"
            : saveMutation.isError
              ? "Save failed — retry by editing"
              : saveMutation.isSuccess
                ? "Synced"
                : "Autosave on pause"}
        </span>
      </footer>
    </div>
  );
}

export default WritingCanvas;
