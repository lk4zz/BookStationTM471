import Styles from "./SearchContent.module.css";
import BookCoverCard from "../../../../../../GlobalComponents/Books/BookCards/BookCoverCard/BookCoverCard";
import AuthorGrid from "../../../../../../GlobalComponents/Books/AuthorGridCard/AuthorGrid/AuthorGrid";
import { useUserSearch } from "../../../../../../hooks/UserHooks/UseUser";
import SkeletonLoading from "../../../../../../GlobalComponents/Feedback/Loading/SkeletonLoading";

function SearchContent({ searchQuery, searchResults, viewsByBookId, ratingsByBookId }) {

    const { authors: matchedAuthors, isLoading: isUsersLoading } = useUserSearch(searchQuery);

    if (isUsersLoading) {
        return (
            <section className={Styles.searchContentSection}>
                <h2 className={Styles.sectionHeader}>Search Results</h2>
                <SkeletonLoading
                    layout={[
                        { type: "title", width: "30%", height: "20px" },
                        "avatar",
                        { type: "title", width: "45%", height: "18px" },
                        { type: "image", height: "220px" },
                    ]}
                />
            </section>
        );
    }

    const noBooks = searchResults.length === 0;
    const noAuthors = matchedAuthors.length === 0;

    return (
        <section className={Styles.searchContentSection}>
            <h2 className={Styles.sectionHeader}>Search Results</h2>
            
            <div className={Styles.resultsGroup}>
                <h3 className={Styles.groupTitle}>Authors:</h3>
                {noAuthors ? (
                    <p className={Styles.noResults}>No authors found for "{searchQuery}"</p>
                ) : (
                    <AuthorGrid authors={matchedAuthors} />
                )}
            </div>

            <div className={Styles.resultsGroup}>
                <h3 className={Styles.groupTitle}>Books:</h3>
                {noBooks ? (
                    <p className={Styles.noResults}>No books found for "{searchQuery}"</p>
                ) : (
                    <div className="gridContainer">
                        {searchResults.map((book) => (
                            <BookCoverCard
                                key={book.id}
                                book={book}
                                totalViews={viewsByBookId?.[book.id]}
                                ratingAverage={ratingsByBookId?.[book.id]?.ratingAverage}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default SearchContent;