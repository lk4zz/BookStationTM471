import BookCard from "../../../../../../components/UI/BookCard/BookCard";

function LibraryBookCard({ book, progress, onRemove, isRemoving }) {
  return (
    <BookCard
      book={book}
      progress={progress}
      onRemoveFromLibrary={() => onRemove(book.id)}
      isRemoving={isRemoving}
    />
  );
}

export default LibraryBookCard;
