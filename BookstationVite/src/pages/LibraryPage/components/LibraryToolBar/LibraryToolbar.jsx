import styles from "./LibraryToolbar.module.css";

function LibraryToolbar({
  itemsCount,
  genres,
  genreFilter,
  setGenreFilter,
  sortBy,
  setSortBy,
}) {
  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>My Library</h1>
        <span className={styles.countBadge}>
          {itemsCount} {itemsCount === 1 ? "Book" : "Books"}
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
    </>
  );
}

export default LibraryToolbar;