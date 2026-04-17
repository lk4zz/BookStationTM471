import { useRef } from "react";
import { useEditBookDetails } from "../../../hooks/useBooks";
import { resolveImageUrl } from "../../../utils/ImageUrl";
import styles from "./EditBookModal.module.css";

/**
 * Book details editor (create or edit). Owns `useEditBookDetails` so callers can
 * keep page-specific wiring in `useWritingBookPage` / `useWritingDashboardPage`.
 */
function EditBookModal({ book, onError, onClose }) {
  const fileInputRef = useRef(null);

  const {
    title,
    setTitle,
    description,
    setDescription,
    coverPreview,
    isCoverLoading,
    genres,
    selectedGenres,
    isSaving,
    handleCoverChange,
    toggleGenre,
    handleSave,
    isCreateMode,
  } = useEditBookDetails(book, onError);

  const coverSrc = coverPreview ?? resolveImageUrl(book?.coverImage);
  const heading = isCreateMode ? "New draft book" : "Edit Book";
  const coverLabel = isCoverLoading ? "Uploading…" : "Change cover";
  const primaryLabel = isCreateMode
    ? isSaving
      ? "Creating…"
      : "Create"
    : isSaving
      ? "Saving…"
      : "Save Changes";

  const onSave = () => {
    handleSave(onClose);
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-book-modal-heading"
      >
        <h2 id="edit-book-modal-heading" className={styles.heading}>
          {heading}
        </h2>

        <div className={styles.body}>
          <div className={styles.coverSide}>
            <div
              className={styles.coverWrapper}
              onClick={() => fileInputRef.current?.click()}
            >
              <img
                src={coverSrc}
                alt={book?.name ?? "Book cover"}
                className={styles.coverImage}
              />
              <div className={styles.coverOverlay}>{coverLabel}</div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.hiddenInput}
              onChange={handleCoverChange}
            />
          </div>

          <div className={styles.detailsSide}>
            <label className={styles.fieldLabel}>
              Title
              <input
                type="text"
                className={styles.textInput}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label className={styles.fieldLabel}>
              Description
              <textarea
                className={styles.textArea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </label>

            <div className={styles.genreSection}>
              <span className={styles.genreLabel}>Genres</span>
              <div className={styles.genreGrid}>
                {genres?.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    className={`${styles.genreChip} ${selectedGenres.includes(g.id) ? styles.genreActive : ""}`}
                    onClick={() => toggleGenre(g.id)}
                  >
                    {g.type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={onSave}
            disabled={isSaving || (isCreateMode && !title.trim())}
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditBookModal;
