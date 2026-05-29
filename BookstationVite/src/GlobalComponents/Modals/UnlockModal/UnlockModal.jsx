import styles from "./UnlockModal.module.css";

function UnlockModal({
  isOpen,
  title,
  message,
  onClose,
  onUnlock,
  isPending = false,
  unlockText = "Unlock",
  pendingText = "Processing...",
  cancelText = "Cancel",
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div 
        className={styles.modal} 
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="unlock-modal-heading"
      >
        {title ? <h2 id="unlock-modal-heading" className={styles.heading}>{title}</h2> : null}
        {message ? <p className={styles.message}>{message}</p> : null}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={isPending}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={styles.unlockBtn}
            onClick={onUnlock}
            disabled={isPending}
          >
            {isPending ? pendingText : unlockText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UnlockModal;
