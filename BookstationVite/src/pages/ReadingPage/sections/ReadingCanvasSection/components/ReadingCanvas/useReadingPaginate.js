import { useLayoutEffect, useRef, useState, useCallback } from "react";
import { getReadingContentBox } from "./readingCanvas.dimensions";
import { paginateChapterHtml } from "./readingPaginate";

export function useReadingPaginate(htmlString, chapterTitle, classNames) {
  const wrapRef = useRef(null);
  const [pageBodies, setPageBodies] = useState(() => [""]);

  const runPaginate = useCallback(
    (wrapperWidthPx) => {
      if (!Number.isFinite(wrapperWidthPx) || wrapperWidthPx < 120) return;
      const { contentWidth, contentHeight } = getReadingContentBox(wrapperWidthPx);
      const next = paginateChapterHtml(htmlString ?? "", chapterTitle ?? "", {
        contentWidthPx: contentWidth,
        contentHeightPx: contentHeight,
        pageContentClass: classNames.pageContent,
        chapterTitleClass: classNames.chapterTitle,
        htmlBodyClass: classNames.htmlBody,
      });
      setPageBodies(next);
    },
    [htmlString, chapterTitle, classNames.pageContent, classNames.chapterTitle, classNames.htmlBody]
  );

  useLayoutEffect(() => {
    const node = wrapRef.current;
    if (!node) return undefined;
    const innerWidth = () => {
      const s = getComputedStyle(node);
      const pad =
        (parseFloat(s.paddingLeft) || 0) + (parseFloat(s.paddingRight) || 0);
      return node.clientWidth - pad;
    };
    const ro = new ResizeObserver(() => {
      runPaginate(innerWidth());
    });
    ro.observe(node);
    runPaginate(innerWidth());
    return () => ro.disconnect();
  }, [runPaginate]);

  return { wrapRef, pageBodies };
}
