import styles from "./BookChapter.module.css";

function BookChatpers({ chapter }) {
  return (
    <div>
        <li className={styles.chapter}>{chapter.chapterNum}. {chapter.title}</li>
    </div>
  );
}

export default BookChatpers;
