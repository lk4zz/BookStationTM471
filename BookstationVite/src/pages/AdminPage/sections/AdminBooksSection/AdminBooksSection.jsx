import { useState } from "react";
import WarningModal from "../../../../GlobalComponents/Modals/WarningModal/WarningModal";
import { BookOpen } from "lucide-react";
import { AdminBooksTable } from "./components/AdminBooksTable";
import styles from "./AdminBooksSection.module.css";

export function AdminBooksSection({
  books,
  onDeleteBook,
  isDeleting,
  flagBook,
  isFlaggingBook,
  unflagBook,
  isUnflaggingBooks,
  showHeading = true,
  catalogEmpty = false,
  searchQuery = "",
}) {
  const [bookToDelete, setBookToDelete] = useState(null);
  const [bookToFlag, setBookToFlag] = useState(null);
  const [flagMessage, setFlagMessage] = useState("");

  if (!books || books.length === 0) {
    const msg =
      catalogEmpty && !String(searchQuery).trim()
        ? "No public books in the catalog."
        : "No books match this search.";
    return (
      <div className={styles.emptyState}>
        <BookOpen size={48} className={styles.emptyIcon} />
        <p>{msg}</p>
      </div>
    );
  }

  const handleFlagAction = (book) => {
    if (book.isFlagged) {
      unflagBook(book.id);
    } else {
      setFlagMessage("");
      setBookToFlag(book);
    }
  };

  return (
    <section className={styles.section}>
      {showHeading && (
        <div className={styles.headerRow}>
          <h2 className={styles.heading}>Catalog Books</h2>
          <span className={styles.bookCount}>{books.length} Total</span>
        </div>
      )}
      
      <AdminBooksTable 
        books={books}
        handleFlagAction={handleFlagAction}
        isFlaggingBook={isFlaggingBook}
        isUnflaggingBooks={isUnflaggingBooks}
        setBookToDelete={setBookToDelete}
        isDeleting={isDeleting}
      />

      {/* Delete Modal */}
      {bookToDelete && (
        <WarningModal
          heading="Delete Book Permanently?"
          message={`Delete "${bookToDelete.name ?? "this book"}" permanently? This cannot be undone.`}
          onConfirm={() => {
            onDeleteBook(bookToDelete.id);
            setBookToDelete(null);
          }}
          onClose={() => setBookToDelete(null)}
          isPending={isDeleting}
          confirmText="Delete Book"
          pendingText="Deleting…"
        />
      )}

      {/* Flag Modal */}
      {bookToFlag && (
        <WarningModal
          heading="Flag Book?"
          message={`Flag "${bookToFlag.name ?? "this book"}" and hide it from the catalog? Enter a reason to send to the author:`}
          textField={true}
          inputValue={flagMessage}
          onInputChange={setFlagMessage}
          inputPlaceholder="Reason for flagging..."
          onConfirm={() => {
            if (flagMessage.trim()) {
              flagBook({ bookId: bookToFlag.id, message: flagMessage });
              setBookToFlag(null);
            }
          }}
          onClose={() => setBookToFlag(null)}
          isPending={isFlaggingBook}
          confirmText="Flag Book"
          pendingText="Flagging…"
        />
      )}
    </section>
  );
}