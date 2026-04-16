import Styles from "./ExploreContent.module.css";
import BooksCarousel from "../../../../components/UI/BooksCarousel/BooksCarousel";
import BookCoverCard from "../../../../components/UI/BookCoverCard/BookCoverCard";
import Loading from "../../../../components/UI/Loading/Loading";
import { useSearch } from "../../../../hooks/useSearch";

function ExploreContent({
    searchQuery,
    displayedBooks,
    viewsByBookId,
    forYouBooks,
}) {
    const { searchResults, isSearchLoading } = useSearch(searchQuery);
    const isSearching = searchQuery?.trim().length > 0;

    if (isSearching) {
        if (isSearchLoading) return <Loading />;

        return (
            <div className={Styles.exploreContent}>
                <p className="headers">Search Results</p>
                {searchResults.length === 0 ? (
                    <p>No books found for "{searchQuery}"</p>
                ) : (
                    <div className="gridContainer">
                        {searchResults.map((book) => (
                            <BookCoverCard key={book.id} book={book} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={Styles.exploreContent}>
            <p className="headers">Popular Books</p>
            <BooksCarousel
                books={displayedBooks}
                viewsByBookId={viewsByBookId}
            />

            <p className="headers">For you</p>
            <div className="gridContainer">
                {forYouBooks.map((book) => (
                    <BookCoverCard key={book.id} book={book} />
                ))}
            </div>
        </div>
    );
}

export default ExploreContent;
