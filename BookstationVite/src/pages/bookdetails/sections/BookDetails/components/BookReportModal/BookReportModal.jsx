// BookReportModal.jsx
import React from "react";
import styles from "./BookReportModal.module.css";
import { useBookDetailsContext } from "../../../../context/BookDetailsContext"; 

function BookReportModal() {
  const {
    book,
    reportModal, // replaces isOpen
    closeReportModal, // replaces onClose
    createReportMutation,
    reason, // Make sure these two are exported from your Context Provider!
    comment,
    handleReportComment,
    handleReportReason,
    handleSubmitReport,
  } = useBookDetailsContext();

  if (!reportModal) return null;

  return (
    <div className={styles.overlay} onClick={closeReportModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Report Book</h3>
          <button className={styles.closeBtn} onClick={closeReportModal}>X</button>
        </div>

        <form onSubmit={handleSubmitReport} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="reason">Reason for reporting</label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => handleReportReason(e.target.value)}
              className={styles.input}
            >
              <option value="SPAM">Spam</option>
              <option value="OFFENSIVE">Offensive Content</option>
              <option value="COPYRIGHT">Copyright Violation</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="comment">Additional Comments (Optional)</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => handleReportComment(e.target.value)}
              className={styles.textarea}
              placeholder="Provide more details..."
              rows="4"
            />
          </div>

          {createReportMutation.isError && (
            <p className={styles.errorText}>
              {createReportMutation.error.response?.data?.message || "Error submitting report."}
            </p>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={createReportMutation.isPending} // Updated to isPending for React Query v5
          >
            {createReportMutation.isPending ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookReportModal;