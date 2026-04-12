import { useState } from "react";
import styles from "./LaunchModal.module.css";

function LaunchModal({ chapters, onLaunch, onClose, isPending, error }) {
  const first3 = (chapters ?? []).filter((ch) => ch.chapterNum <= 3);

  const [prices, setPrices] = useState(() =>
    Object.fromEntries(
      first3.map((ch) => [ch.id, ch.chapterNum === 1 ? 0 : ch.price ?? 0])
    )
  );

  const setPrice = (id, value) =>
    setPrices((prev) => ({ ...prev, [id]: value }));

  const handleLaunch = () => {
    const chapterPrices = first3
      .filter((ch) => ch.chapterNum !== 1)
      .map((ch) => ({
        chapterId: ch.id,
        price: Math.max(0, parseInt(prices[ch.id], 10) || 0),
      }));

    onLaunch(chapterPrices);
  };

  const notEnough = first3.length < 3;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.heading}>Launch Book</h2>
        <p className={styles.subtext}>
          Publishing your first 3 chapters will make the book publicly visible.
          Chapter 1 is always free. Set prices for chapters 2 and 3.
        </p>

        {notEnough && (
          <p className={styles.error}>
            You need at least 3 chapters to launch. Currently: {first3.length}.
          </p>
        )}

        {first3.map((ch) => (
          <div key={ch.id} className={styles.chapterRow}>
            <div className={styles.chapterInfo}>
              <span className={styles.chapterName}>
                {ch.chapterNum}. {ch.title}
              </span>
              {ch.wordCount > 0 && (
                <span className={styles.wordCount}>{ch.wordCount} words</span>
              )}
            </div>

            {ch.chapterNum === 1 ? (
              <span className={styles.freeTag}>Free</span>
            ) : (
              <label className={styles.priceLabel}>
                Price
                <input
                  type="number"
                  min={0}
                  className={styles.priceInput}
                  value={prices[ch.id] ?? 0}
                  onChange={(e) => setPrice(ch.id, e.target.value)}
                />
              </label>
            )}
          </div>
        ))}

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isPending}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.launchBtn}
            onClick={handleLaunch}
            disabled={isPending || notEnough}
          >
            {isPending ? "Launching..." : "Launch"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LaunchModal;
