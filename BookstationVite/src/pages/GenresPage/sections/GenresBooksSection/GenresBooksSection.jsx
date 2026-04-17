import BookCoverCard from "../../../../components/UI/BookCoverCard/BookCoverCard";

function GenresBooksSection({
  books,
  isBooksLoading,
  booksError,
  viewsByBookId = {},
  ratingsByBookId = {},
}) {
  if (isBooksLoading) return <p className="loading">Loading...</p>;
  if (booksError) return <p className="loading">{booksError.message}</p>;

  return (
    <div className="gridContainer">
      {books.map((book) => (
        <BookCoverCard
          key={book.id}
          book={book}
          totalViews={viewsByBookId[book.id]}
          ratingAverage={ratingsByBookId[book.id]?.ratingAverage}
        />
      ))}
    </div>
  );
}

export default GenresBooksSection;
