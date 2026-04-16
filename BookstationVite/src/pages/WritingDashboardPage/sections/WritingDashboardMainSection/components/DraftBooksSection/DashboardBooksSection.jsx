import DraftBookCard from "../DraftBookCard/DraftBookCard";
import styles from "../../../../WritingDashboardPage.module.css";
import Loading from "../../../../../../components/UI/Loading/Loading";

function DashboardBooksSection({ isLoading, error, onDelete,
  booksByAuthor, isBooksByAuthorLoading, booksByAuthorError, activeTab }) {

  if (isBooksByAuthorLoading || isLoading) return <Loading />
  if (booksByAuthorError || error) booksByAuthor = [];

  const draftBooks = booksByAuthor?.filter((book) => book.status === "DRAFT");
  const onGoingBooks = booksByAuthor?.filter((book) => book.status === "ONGOING");
  const completedBooks = booksByAuthor?.filter((book) => book.status === "COMPLETED");

  let booksToShow = draftBooks;
  if (activeTab === "COMPLETED") {
    booksToShow = completedBooks;
  } else if (activeTab === "ONGOING") {
    booksToShow = onGoingBooks;
  }

  if (booksToShow.length === 0) {
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
