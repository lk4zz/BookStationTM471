import BookCoverCard from "../../../../components/UI/BookCoverCard/BookCoverCard";
import { useBooksByGenre } from "../../../../hooks/useBooks";
import { useViewsByBookIds } from "../../../../hooks/useViews";

function GenresBooksSection(incomingGenreData) {
  const { genre } = incomingGenreData;
  const genreId = genre;
  const { books, isBooksLoading, booksError } = useBooksByGenre(genreId);
  const ids = (books ?? []).map((b) => b.id).filter((id) => Number.isFinite(Number(id)));
  const { viewsByBookId } = useViewsByBookIds(ids);

  if (isBooksLoading) return <p className="loading">Loading...</p>;
  if (booksError) return <p className="loading">{booksError.message}</p>;

  return (
    <div className="gridContainer">
      {books.map((book) => (
        <BookCoverCard key={book.id} book={book} totalViews={viewsByBookId[book.id]} />
      ))}
    </div>
  );
}

export default GenresBooksSection;
