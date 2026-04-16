import LibraryBookCard from "./components/LibraryBookCard/LibraryBookCard";
import { Loading } from "../../../../components/UI/Loading/Loading";
import styles from "./LibraryMainSection.module.css";

function LibraryMainSection({
  libraryItems,
  filteredSorted,
  genres,
  genreFilter,
  setGenreFilter,
  sortBy,
  setSortBy,
  isProgressLoading,
  progressByBookId,
  onRemoveBook,
  isRemoving,
}) {
  return (
    <main className={styles.mainContent}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Library</h1>
        <span className={styles.countBadge}>
          {libraryItems.length}{" "}
          {libraryItems.length === 1 ? "Book" : "Books"}
        </span>
      </div>

      <div className={styles.toolbar}>
        <label className={styles.filterLabel}>
          Genre
          <select
            className={styles.select}
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            <option value="all">All genres</option>
            {(genres ?? []).map((g) => (
              <option key={g.id} value={String(g.id)}>
                {g.type}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.filterLabel}>
          Sort
          <select
            className={styles.select}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="title">Title (A–Z)</option>
            <option value="progressDesc">Reading progress first</option>
            <option value="progressAsc">Not started first</option>
          </select>
        </label>
      </div>

      {isProgressLoading && (
        <div className={styles.inlineLoad}>
          <Loading variant="inline" />
        </div>
      )}

      {!filteredSorted || filteredSorted.length === 0 ? (
        <p className={styles.empty}>No books match these filters.</p>
      ) : (
        <div className={styles.grid}>
          {filteredSorted.map((item) => (
            <LibraryBookCard
              key={item.id}
              book={item.book}
              progress={progressByBookId?.[item.book.id]}
              onRemove={onRemoveBook}
              isRemoving={isRemoving}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default LibraryMainSection;
