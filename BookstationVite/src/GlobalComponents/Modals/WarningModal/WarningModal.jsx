import styles from "./WarningModal.module.css";

function WarningModal({
  heading,
  message,
  onConfirm,
  onClose,
  isPending,
  confirmText = "Confirm",
  cancelText = "Cancel",
  pendingText = "Updating…",
  textField = false,
  inputValue = "",
  onInputChange,
  inputPlaceholder = "Enter text...",
}) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {heading && <h2 className={styles.heading}>{heading}</h2>}
        {message && <p className={styles.subtext}>{message}</p>}

        {textField && (
          <textarea
            className={styles.inputField}
            value={inputValue}
            onChange={(e) => onInputChange && onInputChange(e.target.value)}
            placeholder={inputPlaceholder}
            disabled={isPending}
            rows={3}
          />
        )}

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
            className={styles.confirmBtn}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? pendingText : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WarningModal;