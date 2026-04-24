import styles from "./CompletedWarningModal.module.css";

function CompletedWarningModal({ onConfirm, onClose, isPending }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.heading}>Mark book as completed?</h2>
        <p className={styles.subtext}>
          Completed books cannot be edited again. Chapters, the editor, and book
          metadata will stay as they are now. This cannot be undone from the
          writing dashboard.
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.confirmBtn}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Updating…" : "Mark completed"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompletedWarningModal;
