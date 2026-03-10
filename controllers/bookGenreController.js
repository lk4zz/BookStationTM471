const bookGenreService = require('../services/bookGenreServices');

const tagBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const currentUserId = req.user.userId; 
        
        // expects an array of genre IDs from the React frontend
        const { genreIds } = req.body; 

        if (!Array.isArray(genreIds) || genreIds.length === 0) {
            return res.status(400).json({ error: "Please provide an array of genre IDs." });
        }

        await bookGenreService.tagBookWithGenres(bookId, genreIds, currentUserId);

        res.status(200).json({ message: "Book successfully tagged with genres!" });

    } catch (error) {
        console.error(error);
        if (error.message === "Book not found") {
            return res.status(404).json({ error: error.message });
        }
        if (error.message.includes("Forbidden")) {
            return res.status(403).json({ error: error.message });
        }
        res.status(500).json({ error: "Something went wrong while tagging the book." });
    }
};

module.exports = {
    tagBook
};