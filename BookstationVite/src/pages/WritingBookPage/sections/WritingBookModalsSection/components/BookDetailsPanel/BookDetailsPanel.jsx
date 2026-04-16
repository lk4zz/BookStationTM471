import { useRef } from "react";
import { useEditBookDetails } from "../../../../../../hooks/useBooks";
import { resolveImageUrl } from "../../../../../../utils/ImageUrl";
import styles from "./BookDetailsPanel.module.css";

function BookDetailsPanel({ book, onError, onClose }) {
  const fileInputRef = useRef(null);

  const {
    title, setTitle,
    description, setDescription,
    coverPreview, isCoverLoading,
    genres, selectedGenres,
    isSaving,
    handleCoverChange, toggleGenre, handleSave,
  } = useEditBookDetails(book, onError);

  const coverSrc = coverPreview ?? resolveImageUrl(book.coverImage);

  const onSave = () => {
    handleSave();
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.heading}>Edit Book</h2>

        <div className={styles.body}>
          <div className={styles.coverSide}>
            <div
              className={styles.coverWrapper}
              onClick={() => fileInputRef.current?.click()}
            >
              <img src={coverSrc} alt={book.name} className={styles.coverImage} />
              <div className={styles.coverOverlay}>
                {isCoverLoading ? "Uploading..." : "Change cover"}
              </div>
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
          <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSaving}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookDetailsPanel;
