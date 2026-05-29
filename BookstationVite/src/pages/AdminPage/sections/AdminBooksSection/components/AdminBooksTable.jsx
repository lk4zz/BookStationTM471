import { useNavigate } from "react-router-dom";
import { Flag, FlagOff, Trash, Eye, Star, Settings2, AlertTriangle, CheckCircle } from "lucide-react";
import styles from "./AdminBooksTable.module.css";

export function AdminBooksTable({ books, handleFlagAction, isFlaggingBook, isUnflaggingBooks, setBookToDelete, isDeleting }) {
  const navigate = useNavigate();

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.colId}>ID</th>
            <th className={styles.colDetails}>Book Details</th>
            <th className={styles.colStats}>Stats</th>
            <th className={styles.colActions}>
              <div className={styles.thContentEnd}><Settings2 size={14} /> Actions</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className={book.isFlagged ? styles.rowFlagged : ""}>
              <td className={styles.idCell}>#{book.id}</td>

              <td>
                <button type="button" className={styles.bookInfo} onClick={() => navigate(`/book/${book.id}`)}>
                  <div className={styles.bookDetails}>
                    <span className={styles.bookTitle}>{book.name ?? "Untitled"}</span>
                    <div className={styles.metaRow}>
                      <span className={styles.textMuted}>
                        {book.author?.name ? `By ${book.author.name}` : "Unknown Author"}
                      </span>
                      <span className={styles.dotSeparator}>•</span>
                      {book.isFlagged ? (
                        <span className={`${styles.badge} ${styles.badgeFlagged}`}><AlertTriangle size={10} /> Flagged</span>
                      ) : (
                        <span className={`${styles.badge} ${styles.badgePublic}`}><CheckCircle size={10} /> Public</span>
                      )}
                    </div>
                  </div>
                </button>
              </td>

              <td>
                <div className={styles.bookStats}>
                  <span className={styles.statItem}><Star size={14} />{book?._count?.ratings ?? 0} ratings</span>
                  <span className={styles.statItem}><Eye size={14} />{book?._count?.views ?? 0} views</span>
                  <span className={styles.statItem}>{book?._count?.chapters ?? 0} chapters</span>
                </div>
              </td>

              <td>
                <div className={styles.actionsContainer}>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${book.isFlagged ? styles.unflagBtn : styles.flagBtn}`}
                    disabled={isFlaggingBook || isUnflaggingBooks}
                    onClick={() => handleFlagAction(book)}
                  >
                    {book.isFlagged ? <><FlagOff size={14} /> Unflag</> : <><Flag size={14} /> Flag</>}
                  </button>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    disabled={isDeleting}
                    onClick={() => setBookToDelete(book)}
                  >
                    <Trash size={14} /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}