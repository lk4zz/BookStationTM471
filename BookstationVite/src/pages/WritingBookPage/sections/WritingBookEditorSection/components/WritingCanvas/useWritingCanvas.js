/**
 * TipTap editor + debounced autosave for the primary chapter page HTML.
 * Colocated with WritingCanvas styles (no hooks → pages import inversion).
 */
import { useEditor } from "@tiptap/react";
import { useCallback, useEffect, useRef } from "react";
import { useUpsertPrimaryPage } from "../../../../../../hooks/useWritingPages";
import { extensions } from "../../../../../../utils/tiptapExtensions";
import {
  calculateWordCount,
  estimatePageCount,
  EMPTY_DOC_HTML,
} from "../../../../features/writingMetrics";
import styles from "./WritingCanvas.module.css";

const AUTOSAVE_DEBOUNCE_MS = 2000;

export function useWritingCanvas({ chapterId, bookId, initialHtml, isLoading }) {
  const databaseSaveAction = useUpsertPrimaryPage();
  const typingTimer = useRef(null);
  const previouslySavedContent = useRef("");
  const currentContentRef = useRef(EMPTY_DOC_HTML);

  const sendDataToDatabase = useCallback(
    (currentText) => {
      if (!chapterId || !Number.isFinite(Number(chapterId))) return;
      if (currentText === previouslySavedContent.current) return;

      previouslySavedContent.current = currentText;

      databaseSaveAction.mutate({
        chapterId,
        text: currentText,
        bookId,
      });
    },
    [chapterId, bookId, databaseSaveAction.mutate],
  );

  const restartAutosaveTimer = useCallback(
    (currentText) => {
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
      }
      typingTimer.current = setTimeout(() => {
        sendDataToDatabase(currentText);
      }, AUTOSAVE_DEBOUNCE_MS);
    },
    [sendDataToDatabase],
  );

  const textEditorInstance = useEditor(
    {
      extensions: extensions,
      content: EMPTY_DOC_HTML,
      editorProps: {
        attributes: { class: styles.tiptapInner },
      },
      onUpdate: (props) => {
        const currentHtml = props.editor.getHTML();
        currentContentRef.current = currentHtml;
        restartAutosaveTimer(currentHtml);
      },
    },
    [chapterId],
  );

  useEffect(() => {
    if (!textEditorInstance || isLoading) return;

    const startingText = initialHtml || EMPTY_DOC_HTML;
    currentContentRef.current = startingText;
    previouslySavedContent.current = startingText;

    textEditorInstance.commands.setContent(startingText, { emitUpdate: false });
  }, [chapterId, textEditorInstance, isLoading, initialHtml]);

  useEffect(() => {
    return () => {
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
        typingTimer.current = null;
      }
      const html = currentContentRef.current;
      if (html !== previouslySavedContent.current) {
        sendDataToDatabase(html);
      }
    };
  }, [chapterId, sendDataToDatabase]);

  const activeHtmlString = textEditorInstance?.getHTML() ?? "";
  const calculatedWordCount = calculateWordCount(activeHtmlString);
  const estimatedPages = estimatePageCount(calculatedWordCount);

  let currentSaveStateLabel = "Autosave on pause";

  if (databaseSaveAction.isPending) {
    currentSaveStateLabel = "Saving…";
  } else if (databaseSaveAction.isError) {
    currentSaveStateLabel =
      databaseSaveAction.error?.message || "Save failed — retry by editing";
  } else if (databaseSaveAction.isSuccess) {
    currentSaveStateLabel = "Synced";
  }

  return {
    editor: textEditorInstance,
    words: calculatedWordCount,
    approxPages: estimatedPages,
    saveStatus: currentSaveStateLabel,
  };
}
