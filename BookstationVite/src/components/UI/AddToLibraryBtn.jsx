import { useAddToLibrary, useRemoveFromLibrary } from "../../hooks/useLibrary";
import { useLibraryBooks } from "../../hooks/useLibrary";
import styles from "./AddToLibraryBtn.module.css"

function AddToLibraryBtn({bookId}) {
    const { data: libraryBooks } = useLibraryBooks();

    const isBookInLibrary = libraryBooks?.some((book) => book.bookId === bookId);

    const addToLibraryMutation = useAddToLibrary();
    const removeFromLibraryMutation = useRemoveFromLibrary();

    const handleAddToLibrary = () => {
        if (isBookInLibrary) {
            removeFromLibraryMutation.mutate(bookId);

        } else {
            addToLibraryMutation.mutate(bookId);
        }
    };

    return (
        <button
            className={styles.secondaryBtn}
            onClick={handleAddToLibrary}
            disabled={addToLibraryMutation.isPending || removeFromLibraryMutation.isPending}
        >
            {isBookInLibrary ? "Remove from Library" : "Add to Library"}
        </button>
    )

}

export default AddToLibraryBtn;