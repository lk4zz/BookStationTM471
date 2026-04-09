import Styles from "./explore.module.css";
import BookCard from "../../components/UI/BookCard/BookCard";
import NavBar from "../../components/UI/NavBar/NavBar";
import TopPicks from "../../components/ExplorePageComp/TopPicks/TopPicks";
import { useAllBooks, useBookById } from "../../hooks/useBooks";
import { useMostViewedBook } from "../../hooks/useViews";
import { useTopBooks } from "../../hooks/useViews";


function Explore() {

  const { books, isBooksLoading, booksError } = useAllBooks()
  const { topBooks, isTopBooksLoading, topBooksError } = useTopBooks();
  const { mostViewedBook } = useMostViewedBook()
  const { book } = useBookById(mostViewedBook)
  if (!book) return <p className={Styles.loading}> Loading...</p>;
  if (!books) return <p className={Styles.loading}> Loading...</p>;
  if (isBooksLoading) return <p className={Styles.loading}> Loading...</p>;
  if (isTopBooksLoading) return <p className={Styles.loading}> Loading...</p>;
  if (booksError) return <p className={Styles.error}> {booksError.message}</p>;

  return (
    <div>
      <NavBar />

      <div className={Styles.topPicks} >
        <TopPicks book={book} />
      </div>

      <p className={Styles.headers}>Most Popular</p>
      
      <div className="gridContainer">
        {topBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      <p className={Styles.headers}>Popular Books</p>

      <div className="gridContainer">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>



    </div>

  );
}

export default Explore;
