const bookGenreService = require('../../services/booksServices/bookGenreServices');
const catchAsync = require('../../middlewares/catchAsync');

const tagBook = catchAsync(async (req, res) => {

        const { bookId } = req.params;
        const currentUserId = req.user.userId; 
        
        // expects an array of genre IDs from the React frontend
        const { genreIds } = req.body; 

        if (!Array.isArray(genreIds) || genreIds.length === 0) {
            return res.status(400).json({ error: "Please provide an array of genre IDs." });
        }

        await bookGenreService.tagBookWithGenres(bookId, genreIds, currentUserId);

        res.status(200).json({ message: "Book successfully tagged with genres!" });

});

module.exports = {
    tagBook
};