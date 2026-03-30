import listStyles from "./UserBooksList.module.css";
import BookCard from "../../UI/BookCard/BookCard";

export function UserBooksList({ books, authorName, isLoading }) {
    return (
        <div className={listStyles.listContainer}>
            <h3 className={listStyles.sectionTitle}>Published Works</h3>

            {isLoading ? (
                <p className={listStyles.emptyState}>Loading books…</p>
            ) : !books?.length ? (
                <p className={listStyles.emptyState}>
                    {authorName} hasn't published any books yet.
                </p>
            ) : (
                <div className="gridContainer">
                    {books.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default UserBooksList;