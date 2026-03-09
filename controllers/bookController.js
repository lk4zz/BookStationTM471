const bookService = require('../services/bookServices');  //import service

const createBook = async (req, res) => {
    try {
        const { title, description } = req.body;
        const authorId = req.user.userId;

        const newBook = await bookService.createBook(title, description, authorId);

        res.status(201).json({
            message: "Book published successfully!",
            book: newBook
        });
    } catch (error) {
     
        console.error(error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "A book with this title already exists. Please choose a different title." });
        }
        res.status(500).json({ error: "Something went wrong while publishing the book." });
    }
};

const getAllBooks = async (req, res) => {
    try {
        const books = await bookService.getAllBooks();

        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error: Could not fetch the BookStation library." });
    }
};

const getBookById = async (req, res) => {
    try {
        const book = await bookService.getBookById(req.params.id);

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        console.error(error);
        if (error.message === "Book not found") {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ success: false, message: "Server Error: Could not fetch the book." });
    }
};

const getBooksByAuthor = async (req, res) => {
    try {
        const books = await bookService.getBooksByAuthor(req.params.authorId);
        
        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error: Could not fetch the books." });
    }
};

const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user.userId;
        const { title, description } = req.body;

        const updatedBook = await bookService.updateBook(id, currentUserId, title, description);

        res.status(200).json({
            success: true,
            message: "Book successfully updated!",
            data: updatedBook
        });
    } catch (error) {
        console.error(error);
        if (error.message === "Book not found") return res.status(404).json({ error: error.message });
        if (error.message === "You are not the owner of this book.") return res.status(403).json({ error: error.message });
        if (error.message.includes("already exists")) return res.status(400).json({ error: error.message });
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "A book with this title already exists. Please choose a different title." });
        }
        
        res.status(500).json({ success: false, message: "Server Error: Could not update the book." });
    }
};

const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user.userId;

        await bookService.deleteBook(id, currentUserId);

        res.status(200).json({
            success: true,
            message: "Book successfully deleted!"
        });
    } catch (error) {
        console.error(error);
        if (error.message === "Book not found") return res.status(404).json({ error: error.message });
        if (error.message === "You are not the owner of this book.") return res.status(403).json({ error: error.message });
        
        res.status(500).json({ success: false, message: "Server Error: Could not delete the book." });
    }
};

module.exports = {
    createBook,
    getAllBooks,
    getBookById,
    getBooksByAuthor,
    updateBook,
    deleteBook,
};