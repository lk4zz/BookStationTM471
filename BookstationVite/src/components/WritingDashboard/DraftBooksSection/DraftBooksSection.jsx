import DraftBookCard from "../DraftBookCard/DraftBookCard";
import styles from "../../../pages/WritingDashboardPage/WritingDashboardPage.module.css";

function DraftBooksSection({ books, isLoading, error, onDelete }) {

  if (isLoading) return <p className={styles.loading}>Loading your drafts…</p>;
  if (error) return <p className={styles.error}>{error.message}</p>;
  
  if (!books.length) {
    return (
      <div className={styles.empty}>
        <p>No draft books yet.</p>
      </div>
    );
  }

  return (
    <ul className={styles.grid}>
      {books.map((book) => (
        <li key={book.id}>
          <DraftBookCard book={book} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}

export default DraftBooksSection;
