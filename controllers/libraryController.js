const libraryServices = require('../services/libraryServices');
const catchAsync = require('../middlewares/catchAsync');

const saveBook = catchAsync(async (req, res) => {
    try {
    
        const { bookId } = req.params;
        const currentUserId = req.user.userId;


        await libraryServices.addBookToLibrary(currentUserId, bookId);
        res.status(201).json({ message: "Book successfully added to your library!" });

    } catch(error) {
        console.error(error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message || "Something went wrong" });
    }
});

const getlibraryBooks = catchAsync(async(req, res) => {
    try {
        const currentUserId = req.user.userId;
        const libraryBooks = await libraryServices.getLibraryBooks(currentUserId);
        res.status(200).json({
            sucess: true,
            count: libraryBooks.length,
            data: libraryBooks
        })

    } catch (error) {
        console.error(error);
        if (error.message === "Your library is empty.") {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: "Something went wrong while fetching the library." });

    }
});

const removeBookFromLibrary = catchAsync(async (req, res) => {
    try {

        const { bookId } = req.params;
        const currentUserId = req.user.userId
        await libraryServices.removeBookFromLibrary(currentUserId, bookId);
        res.status(200).json({
            success: true,
            message: "Book successfully removed from your library!"
        });


    } catch(error) {
        console.error(error);
        if (error.message === "Book not found") {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === "You don't have a library yet.") {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === "This book is not in your library.") {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === "You are not the owner of this book.") {
            return res.status(403).json({ error: error.message });
        }
        res.status(500).json({ error: "Something went wrong while removing the book from your library." });

    }
});

module.exports = {
    saveBook,
    getlibraryBooks,
    removeBookFromLibrary,
};

