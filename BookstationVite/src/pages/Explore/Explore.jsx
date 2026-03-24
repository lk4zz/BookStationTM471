import { useQuery } from "@tanstack/react-query";
import { getAllBooks } from "../../api/books";
import Styles from "./explore.module.css";
import BookCard from "../../components/ExplorePageComp/BookCard";
import NavBar from "../../components/NavBar";
import TopPicks from "../../components/ExplorePageComp/TopPicks";

function Explore() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["books"],
    queryFn: getAllBooks,
  });

  if (isLoading) return <p className={Styles.loading}> Loading...</p>;
  if (error) return <p className={Styles.error}> {error.message}</p>;

  return (
    <div>
      <NavBar />
      
    <div className = {Styles.topPicks} >
       <TopPicks book={data.data[2]} />
    </div>
    <div className = {Styles.bookcards}>
      {data.data.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
    </div>
  );
}

export default Explore;
