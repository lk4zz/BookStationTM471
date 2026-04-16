import styles from "./WritingChaptersPanel.module.css";

function WritingChapterItem({ ch, isActive, onSelectChapter, onEdit, bookStatus }) {
  return (
    <li className={styles.itemWrap}>
      <button
        className={`${styles.chapterBtn} ${isActive ? styles.active : ""}`}
        onClick={() => onSelectChapter(ch.id)}
      >
        <span className={styles.chapterNum}>{ch.chapterNum}.</span>
        <span className={styles.chapterTitle}>{ch.title}</span>
        <span className={ch.isPublished ? styles.badge : styles.draft}>
          {ch.isPublished ? (ch.price > 0 ? `${ch.price} coins` : "Free") : "Draft"}
        </span>
      </button>
      <div className={styles.row}>
        <button className={styles.linkBtn} onClick={onEdit}>Edit</button>
      </div>
    </li>
  );
}

export default WritingChapterItem;
