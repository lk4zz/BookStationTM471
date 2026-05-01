import { useAddToLibrary, useRemoveFromLibrary } from "../../../hooks/useLibrary";
import styles from "./AddToLibraryBtn.module.css"
import { checkIfGuest } from "../../../utils/checkIfGuest";
// 1. Import toast
import toast from 'react-hot-toast';

function AddToLibraryBtn({bookId, isBookInLibrary}) {
    const isGuest = checkIfGuest();
    const addToLibraryMutation = useAddToLibrary();
    const removeFromLibraryMutation = useRemoveFromLibrary();

    const isLoading = addToLibraryMutation.isPending || removeFromLibraryMutation.isPending;

    const handleAddToLibrary = () => {
        if (isGuest) {
            // 2. Replace the alert with a toast!
            // You can use toast.error, toast.success, or just a custom icon
            toast('Please log in to manage your library.', {
                icon: '🔒',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            return;
        }

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
            disabled={isLoading}
        >
            {isBookInLibrary ? "Remove from Library" : "Add to Library"}
        </button>
    )
}

export default AddToLibraryBtn;