import { useState } from "react";
import styles from "./WritingChaptersPanel.module.css";

function WritingChapterItem({
  ch,
  isActive,
  onSelectChapter,
  onUpdateChapter,
  onDeleteChapter,
  onPublishChapter,
  bookId,
  isBusy,
}) {
  const [priceDraft, setPriceDraft] = useState(ch.price ?? 0);
  const [showPublish, setShowPublish] = useState(false);

  const renameChapter = () => {
    const title = window.prompt("New title", ch.title);
    if (!title?.trim() || title === ch.title) return;
    onUpdateChapter({ chapterId: ch.id, bookId, title: title.trim(), price: ch.price });
  };

  const deleteChapter = () => {
    if (!window.confirm(`Delete chapter "${ch.title}"?`)) return;
    onDeleteChapter({ chapterId: ch.id, bookId });
  };

  const publishChapter = () => {
    const price = Number.parseInt(String(priceDraft), 10);
    if (Number.isNaN(price) || price < 0) return window.alert("Use a valid price.");
    onPublishChapter({ chapterId: ch.id, bookId, price });
    setShowPublish(false);
  };

  return (
    <li className={styles.itemWrap}>
      <button className={`${styles.chapterBtn} ${isActive ? styles.active : ""}`}
        onClick={() => onSelectChapter(ch.id)}>
        <span className={styles.chapterNum}>{ch.chapterNum}.</span>
        <span className={styles.chapterTitle}>{ch.title}</span>
        <span className={ch.isPublished ? styles.badge : styles.draft}>{ch.isPublished ?
          (ch.price > 0 ? `${ch.price} coins` : "Free") : "Draft"}</span>
      </button>
      <div className={styles.row}>
        <button className={styles.linkBtn} onClick={renameChapter}>Rename</button>
        {!ch.isPublished && <button className={styles.linkBtn}
          onClick={() => setShowPublish((v) => !v)}>Publish</button>}
        <button className={styles.dangerBtn} onClick={deleteChapter}>Delete</button>
      </div>
      {showPublish && !ch.isPublished && (
        <div className={styles.publishBox}>
          <label className={styles.priceLabel}>
            Price (0 = free)
            <input type="number" min={0} className={styles.priceInput} value={priceDraft}
              onChange={(e) => setPriceDraft(e.target.value)} />
          </label>
          <button className={styles.confirmPub}
            onClick={publishChapter} disabled={isBusy}>Confirm publish</button>
        </div>
      )}
    </li>
  );
}

export default WritingChapterItem;
