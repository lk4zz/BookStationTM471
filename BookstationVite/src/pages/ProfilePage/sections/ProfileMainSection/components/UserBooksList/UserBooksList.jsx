import listStyles from "./UserBooksList.module.css";
import BookCoverCard from "../../../../../../components/UI/BookCoverCard/BookCoverCard";
import { Loading } from "../../../../../../components/UI/Loading/Loading";
import { useViewsByBookIds } from "../../../../../../hooks/useViews";

export function UserBooksList({ books, authorName, isLoading }) {
  const ids = (books ?? []).map((b) => b.id).filter((id) => Number.isFinite(Number(id)));
  const { viewsByBookId } = useViewsByBookIds(ids);

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
            <BookCoverCard key={book.id} book={book} totalViews={viewsByBookId[book.id]} />
          ))}
        </div>
      )}
    </div>
  );
}

export default UserBooksList;
