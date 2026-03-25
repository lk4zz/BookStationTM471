import Styles from "./explore.module.css";
import BookCard from "../../components/ExplorePageComp/BookCard";
import NavBar from "../../components/NavBar";
import TopPicks from "../../components/ExplorePageComp/TopPicks";
import { useAllBooks } from "../../hooks/useBooks";

function Explore() {
  const { books, isBooksLoading, booksError } = useAllBooks()
  if (isBooksLoading) return <p className={Styles.loading}> Loading...</p>;
  if (booksError) return <p className={Styles.error}> {booksError.message}</p>;
  return (
    <div>
      <NavBar />

      <div className={Styles.topPicks} >
        <TopPicks book={books[2]} />
      </div>
      <div className={Styles.bookcards}>
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

export default Explore;
