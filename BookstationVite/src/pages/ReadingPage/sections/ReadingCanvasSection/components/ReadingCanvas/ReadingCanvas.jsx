import styles from "./ReadingCanvas.module.css";
import { Loading } from "../../../../../../GlobalComponents/Feedback/Loading/Loading";

function ReadingCanvas({ page, isPagesLoading, chapter }) {
  const html = page?.text ?? "";

  if (isPagesLoading) {
    return <Loading variant="inline"/>;
  }

  return (
    <div className={styles.paperWrapper}>
      <article className={styles.pageSheet}>
        <div className={styles.pageContent}>
          <div
            className={styles.htmlBody}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </article>
    </div>
  );
}

export default ReadingCanvas;
