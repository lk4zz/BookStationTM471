import { useState } from "react";
import styles from "./ChapterModal.module.css";

function ChapterModal({
  chapter,
  bookId,
  bookStatus,
  onCreateChapter,
  onUpdateChapter,
  onDeleteChapter,
  onPublishChapter,
  onClose,
  isBusy,
  authorModerationAllowsEditing,
  publishedChapterCount,
}) {
  const isEditMode = !!chapter;
  const [title, setTitle] = useState(chapter?.title ?? "");
  const [price, setPrice] = useState(chapter?.price ?? 0);

  const canSetPrice = bookStatus !== "DRAFT";
  const canPublish = isEditMode && !chapter.isPublished && bookStatus !== "DRAFT";

  // During moderation, prevent deletion if it would drop published chapters below 3.
  const deleteBlockedByModerationFloor =
    authorModerationAllowsEditing && publishedChapterCount <= 3;

  const handleCreate = () => {
    if (!title.trim()) return;
    onCreateChapter({ bookId, title: title.trim() });
    onClose();
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const parsedPrice = Math.max(0, parseInt(price, 10) || 0);
    onUpdateChapter({
      chapterId: chapter.id,
      bookId,
      title: title.trim(),
      price: canSetPrice ? parsedPrice : chapter.price,
    });
    onClose();
  };

  const handleDelete = () => {
    onDeleteChapter({ chapterId: chapter.id, bookId });
    onClose();
  };

  const handlePublish = () => {
    const parsedPrice = Math.max(0, parseInt(price, 10) || 0);
    onPublishChapter({ chapterId: chapter.id, bookId, price: parsedPrice });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.heading}>
          {isEditMode ? "Edit Chapter" : "New Chapter"}
        </h2>

        <label className={styles.fieldLabel}>
          Title
          <input
            type="text"
            className={styles.textInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </label>

        {isEditMode && canSetPrice && (
          <label className={styles.fieldLabel}>
            Price (0 = free)
            <input
              type="number"
              min={0}
              className={styles.textInput}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
        )}

        <div className={styles.actions}>
          <div className={styles.actionsLeft}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isBusy}>
              Cancel
            </button>
            {isEditMode && (
              <div>
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={handleDelete}
                  disabled={isBusy || deleteBlockedByModerationFloor}
                  title={deleteBlockedByModerationFloor ? "Must keep at least 3 published chapters during moderation review." : undefined}
                >
                  Delete
                </button>
                {deleteBlockedByModerationFloor && (
                  <p className={styles.deleteHint}>Need ≥ 3 published chapters</p>
                )}
              </div>
            )}
          </div>

          <div className={styles.actionsRight}>
            {canPublish && (
              <button
                type="button"
                className={styles.publishBtn}
                onClick={handlePublish}
                disabled={isBusy || !title.trim()}
              >
                Publish
              </button>
            )}
            <button
              type="button"
              className={styles.saveBtn}
              onClick={isEditMode ? handleSave : handleCreate}
              disabled={isBusy || !title.trim()}
            >
              {isEditMode ? "Save" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChapterModal;
