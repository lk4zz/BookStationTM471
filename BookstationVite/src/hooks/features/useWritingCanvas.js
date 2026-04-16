import { useEditor } from "@tiptap/react";
import { useCallback, useEffect, useRef } from "react";
import { useUpsertPrimaryPage } from "../useWritingPages";
import {extensions} from "../../utils/tiptapExtensions";
import styles from "../../pages/WritingBookPage/sections/WritingBookEditorSection/components/WritingCanvas/WritingCanvas.module.css";

// save delay time
const MILLISECONDS_TO_WAIT = 2000;

// export function calculateWordCount(rawHtmlString) {
//     if (typeof document === "undefined") return 0;

//     // create an fake container <div> element
//     const temporaryContainer = document.createElement("div");
//     temporaryContainer.innerHTML = rawHtmlString; //html with tags and text content

//     // extract the plain text adnd ignore  the formatting tags
//     const plainTextOnly = temporaryContainer.textContent || "";

//     const wordsArray = plainTextOnly.trim().split(/\s+/).filter(Boolean);
//     return wordsArray.length;  // split by spaces and count the resulting words
// }

// export function estimatePageCount(totalWords) {
//     return Math.max(1, Math.ceil(totalWords / 250)); // book page size (250 words per page)

// }

// Hook
export function useWritingCanvas({ chapterId, bookId, initialHtml, isLoading }) {
    const databaseSaveAction = useUpsertPrimaryPage(); //upsert function

    const typingTimer = useRef(null);
    const previouslySavedContent = useRef("");

    // save logic 
    const sendDataToDatabase = useCallback(
        (currentText) => {
            // If the text matches what we already saved, don't waste a database trip
            if (currentText === previouslySavedContent.current) return;

            previouslySavedContent.current = currentText;

            // Fire the request
            databaseSaveAction.mutate({
                chapterId: chapterId,
                text: currentText,
                bookId: bookId
            });
        },
        [chapterId, bookId, databaseSaveAction],
    );

    const restartAutosaveTimer = useCallback(
        (currentText) => {

            if (typingTimer.current) {
                clearTimeout(typingTimer.current);
            }
            typingTimer.current = setTimeout(() => {
                sendDataToDatabase(currentText);
            }, MILLISECONDS_TO_WAIT);
        },
        [sendDataToDatabase],
    );

    const textEditorInstance = useEditor(
        {
            extensions: extensions,

            content: "<p></p>",

            editorProps: {
                attributes: { class: styles.tiptapInner },
            },

            onUpdate: (props) => {
                const currentHtml = props.editor.getHTML();
                restartAutosaveTimer(currentHtml);
            },
        },
        [chapterId]
    );
    // sync content when the page first loads
    useEffect(() => {
        if (!textEditorInstance || isLoading) return;

        const startingText = initialHtml || "<p></p>";

        previouslySavedContent.current = startingText;

        textEditorInstance.commands.setContent(startingText, { emitUpdate: false });
    }, [chapterId, textEditorInstance, isLoading, initialHtml]);

    // incase the user leaves the page, kill the timer so it doesn't cause errors
    useEffect(() => {
        return () => {
            if (typingTimer.current) {
                clearTimeout(typingTimer.current);
            }
        };
    }, []);

    // Display Values 
    const activeHtmlString = textEditorInstance?.getHTML() ?? "";
    // const calculatedWordCount = calculateWordCount(activeHtmlString);
    // const estimatedPages = estimatePageCount(calculatedWordCount);

    // Status Label 
    // let currentSaveStateLabel = "Autosave on pause";

    // if (databaseSaveAction.isPending) {
    //     currentSaveStateLabel = "Saving…";
    // } else if (databaseSaveAction.isError) {
    //     currentSaveStateLabel = databaseSaveAction.error?.message || "Save failed — retry by editing";
    // } else if (databaseSaveAction.isSuccess) {
    //     currentSaveStateLabel = "Synced";
    // }

    return {
        editor: textEditorInstance,
        // words: calculatedWordCount,
        // approxPages: estimatedPages,
        // saveStatus: currentSaveStateLabel
    };
}