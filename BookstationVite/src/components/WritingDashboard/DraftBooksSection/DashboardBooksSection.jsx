import DraftBookCard from "../DraftBookCard/DraftBookCard";
import styles from "../../../pages/WritingDashboardPage/WritingDashboardPage.module.css";

function DashboardBooksSection({ draftBooks, isLoading, error, onDelete,
    booksByAuthor, isBooksByAuthorLoading, booksByAuthorError, activeTab }) {

    if (isBooksByAuthorLoading || isLoading) return <p className={styles.loading}>Loading your books…</p>
    if (error || booksByAuthorError) return <p className={styles.error}>{error.message}</p>;

    const onGoingBooks = booksByAuthor.filter((book) => book.status === "ONGOING");
    const completedBooks = booksByAuthor.filter((book) => book.status === "COMPLETED");

    let booksToShow = draftBooks;
    if (activeTab === "COMPLETED") {
        booksToShow = completedBooks;
    } else if (activeTab === "ONGOING") {
        booksToShow = onGoingBooks;
    }

      if (!booksToShow.length) {
        return (
          <div className={styles.empty}>
            <p>No books yet.</p>
          </div>
        );
      }

    return (
        <ul className={styles.grid}>


            {booksToShow.map((book) => (
                <li key={book.id}>
                    <DraftBookCard book={book} onDelete={onDelete} />
                </li>
            ))}

        </ul>
    );
}

export default DashboardBooksSection;
