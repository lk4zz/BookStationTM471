import LibraryBookCard from "./LibraryBookCard/LibraryBookCard";
import styles from "./LibraryGrid.module.css";

function LibraryGrid({ books, progressByBookId, onRemoveBook, isRemoving }) {
  if (!books || books.length === 0) {
    return <p className={styles.emptyText}>No books match these filters.</p>;
  }

  return (
    <div className={styles.grid}>
      {books.map((item) => (
        <LibraryBookCard
          key={item.id}
          book={item.book}
          progress={progressByBookId?.[item.book.id]}
          onRemoveFromLibrary={() => onRemoveBook(item.book.id)}
          isRemoving={isRemoving}
        />
      ))}
    </div>
  );
}

export default LibraryGrid;
