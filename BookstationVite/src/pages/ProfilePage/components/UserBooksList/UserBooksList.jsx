import listStyles from "./UserBooksList.module.css";
import BookCoverCard from "../../../../GlobalComponents/Books/BookCards/BookCoverCard/BookCoverCard";
import { Loading } from "../../../../GlobalComponents/Feedback/Loading/Loading";

export function UserBooksList({
  books,
  authorName,
  isLoading,
  ratingsByBookId = {},
}) {

  return (
    <div className={listStyles.listContainer}>
      <h3 className={listStyles.sectionTitle}>Published Works</h3>

      {isLoading ? (
        <div className={listStyles.inlineLoader}>
          <Loading variant="inline" />
        </div>
      ) : !books?.length ? (
        <p className={listStyles.emptyState}>
          {authorName} hasn&apos;t published any books yet.
        </p>
      ) : (
        <div className="gridContainer">
          {books.map((book) => (
            <BookCoverCard
              key={book.id}
              book={book}
              ratingAverage={ratingsByBookId[book.id]?.ratingAverage}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default UserBooksList;
