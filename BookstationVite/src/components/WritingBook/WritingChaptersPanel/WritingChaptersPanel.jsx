import { useState } from "react";
import styles from "./WritingChaptersPanel.module.css";

function WritingChaptersPanel({
  bookId,
  chapters,
  selectedChapterId,
  onSelectChapter,
  onCreateChapter,
  onDeleteChapter,
  onUpdateChapter,
  onPublishChapter,
  isBusy,
}) {
  const [priceDraft, setPriceDraft] = useState({});
  const [publishOpenId, setPublishOpenId] = useState(null);

  const handleAdd = () => {
    const title = window.prompt("Chapter title");
    if (!title?.trim()) return;
    onCreateChapter({ bookId, title: title.trim() });
  };

  const handleRename = (ch) => {
    const title = window.prompt("New title", ch.title);
    if (!title?.trim() || title === ch.title) return;
    onUpdateChapter({
      chapterId: ch.id,
      bookId,
      title: title.trim(),
      price: ch.price,
    });
  };

  const handleDelete = (ch) => {
    if (!window.confirm(`Delete chapter “${ch.title}”?`)) return;
    onDeleteChapter({ chapterId: ch.id, bookId });
  };

  const handlePublish = (ch) => {
    const raw = priceDraft[ch.id];
    const price =
      raw === undefined || raw === "" ? 0 : Number.parseInt(String(raw), 10);
    if (Number.isNaN(price) || price < 0) {
      window.alert("Enter a valid coin price (0 for free).");
      return;
    }
    onPublishChapter({ chapterId: ch.id, bookId, price });
    setPublishOpenId(null);
  };

  return (
    <aside className={styles.panel}>
      <div className={styles.head}>
        <h2 className={styles.title}>Chapters</h2>
        <button
          type="button"
          className={styles.addBtn}
          onClick={handleAdd}
          disabled={isBusy}
        >
          + New
        </button>
      </div>

      <ul className={styles.list}>
        {chapters.length === 0 && (
          <li className={styles.empty}>No chapters yet. Create one to write.</li>
        )}
        {chapters.map((ch) => {
          const active = ch.id === selectedChapterId;
          return (
            <li key={ch.id} className={styles.itemWrap}>
              <button
                type="button"
                className={`${styles.chapterBtn} ${active ? styles.active : ""}`}
                onClick={() => onSelectChapter(ch.id)}
              >
                <span className={styles.chapterNum}>{ch.chapterNum}.</span>
                <span className={styles.chapterTitle}>{ch.title}</span>
                {ch.isPublished ? (
                  <span className={styles.badge}>
                    {ch.price > 0 ? `${ch.price} coins` : "Free"}
                  </span>
                ) : (
                  <span className={styles.draft}>Draft</span>
                )}
              </button>
              <div className={styles.row}>
                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={() => handleRename(ch)}
                >
                  Rename
                </button>
                {!ch.isPublished && (
                  <>
                    <button
                      type="button"
                      className={styles.linkBtn}
                      onClick={() =>
                        setPublishOpenId(publishOpenId === ch.id ? null : ch.id)
                      }
                    >
                      Publish
                    </button>
                    {publishOpenId === ch.id && (
                      <div className={styles.publishBox}>
                        <label className={styles.priceLabel}>
                          Price (coins, 0 = free)
                          <input
                            type="number"
                            min={0}
                            className={styles.priceInput}
                            value={
                              priceDraft[ch.id] ??
                              (ch.price !== undefined ? String(ch.price) : "0")
                            }
                            onChange={(e) =>
                              setPriceDraft((s) => ({
                                ...s,
                                [ch.id]: e.target.value,
                              }))
                            }
                          />
                        </label>
                        <button
                          type="button"
                          className={styles.confirmPub}
                          onClick={() => handlePublish(ch)}
                          disabled={isBusy}
                        >
                          Confirm publish
                        </button>
                      </div>
                    )}
                  </>
                )}
                <button
                  type="button"
                  className={styles.dangerBtn}
                  onClick={() => handleDelete(ch)}
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default WritingChaptersPanel;
