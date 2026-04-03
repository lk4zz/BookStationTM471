import styles from "./ReadingCanvas.module.css";
import { useReadingPaginate } from "./useReadingPaginate";

function ReadingCanvas({ page, isPagesLoading, chapter }) {
  const html = page?.text ?? "";
  const classNames = {
    pageContent: styles.pageContent,
    chapterTitle: styles.chapterTitle,
    htmlBody: styles.htmlBody,
  };

  const { wrapRef, pageBodies } = useReadingPaginate(html, chapter?.title, classNames);

  if (isPagesLoading) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div ref={wrapRef} className={styles.paperWrapper}>
      {pageBodies.map((bodyHtml, index) => (
        <article
          key={`${page?.id ?? "page"}-${index}`}
          className={styles.pageSheet}
          aria-label={index === 0 ? "Page 1" : `Page ${index + 1}`}
        >
          <div className={styles.pageContent}>
            {index === 0 && <h1 className={styles.chapterTitle}>{chapter.title}</h1>}
            <div
              className={styles.htmlBody}
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          </div>
        </article>
      ))}
    </div>
  );
}

export default ReadingCanvas;
