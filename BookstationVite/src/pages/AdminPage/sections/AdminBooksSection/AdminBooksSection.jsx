import styles from "./AdminBooksSection.module.css";

export function AdminBooksSection({
  books,
  onDeleteBook,
  isDeleting,
  showHeading = true,
  catalogEmpty = false,
  searchQuery = "",
}) {
  if (!books || books.length === 0) {
    const msg =
      catalogEmpty && !String(searchQuery).trim()
        ? "No public books in the catalog."
        : "No books match this search.";
    return <p className={styles.empty}>{msg}</p>;
  }

  return (
    <div className={styles.section}>
      {showHeading ? <h2 className={styles.heading}>Catalog books</h2> : null}
      <div className={styles.grid}>
        {books.map((book) => (
          <article key={book.id} className={styles.bookCard}>
            <div className={styles.bookInfo}>
              <h4>{book.name ?? "Untitled"}</h4>
              <p>ID: {book.id}</p>
              {book.author?.name && <p>{book.author.name}</p>}
            </div>
            <button
              type="button"
              className={styles.deleteBtn}
              disabled={isDeleting}
              onClick={() => {
                if (
                  window.confirm(
                    `Delete "${book.name ?? "this book"}" permanently? This cannot be undone.`
                  )
                ) {
                  onDeleteBook(book.id);
                }
              }}
            >
              Delete book
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
