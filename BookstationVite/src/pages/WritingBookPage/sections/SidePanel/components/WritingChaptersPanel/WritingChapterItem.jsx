import styles from "./WritingChapterItem.module.css";

function WritingChapterItem({ ch, isActive, onSelectChapter, onEdit, bookStatus }) {
  return (
    <li className={`${styles.itemWrap} ${isActive ? styles.active : ""}`}>
      {/* Primary Clickable Area */}
      <button
        className={styles.chapterBtn}
        onClick={() => onSelectChapter(ch.id)}
      >
        <div className={styles.titleRow}>
          <span className={styles.chapterNum}>{ch.chapterNum}.</span>
          <span className={styles.chapterTitle} title={ch.title}>
            {ch.title}
          </span>

        </div>
        <span className={ch.isPublished ? styles.badge : styles.draft}>
          {ch.isPublished ? (ch.price > 0 ? `${ch.price} coins` : "Free") : "Draft"}
        </span>
      </button>

        <button className={styles.linkBtn} onClick={onEdit}>
          Edit
        </button>
    </li>
  );
}

export default WritingChapterItem;