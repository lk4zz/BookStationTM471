
const chapterServices = require('../services/chapterServices');

const createChapter = async (req, res) => {
    try {
        const { bookId, title, price } = req.body;
        const currentUserId = req.user.userId;

        const newChapter = await chapterServices.createChapter(bookId, title, currentUserId, price);

        res.status(201).json({
            message: "Chapter created successfully!",
            chapter: newChapter
        });

    } catch (error) {
        console.error(error);
        if (error.message.includes('Book not Found')) {
            return res.status(404).json({ error: error.message });
        }
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "A book with this title already exists. Please choose a different title." });
        }
        if (error.message.includes('Not the author')) {
            return res.status(403).json({ error: error.message });
        }
        res.status(500).json({ error: "Something went wrong while creating the chapter." });
    }
};

const getChaptersByBook = async (req, res) => {
    try {
        const { bookId } = req.params;

        const chapters = await chapterServices.getChaptersByBook(bookId);

        res.status(200).json({
            success: true,
            count: chapters.length,
            data: chapters
        });

    } catch (error) {
        console.error(error);
        if (error.message.includes('no chapters')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: "Something went wrong while fetching the chapters." });
    }
};

const getChapterById = async (req, res) => {
    try {
        const { id } = req.params;
        const chapter = await chapterServices.getChapterById(id);

        res.status(200).json({
            success: true,
            data: chapter
        });

    } catch(error) {
        console.error(error);
        if (error.message.includes('Chapter not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: "Something went wrong while fetching the chapter." });
    }
};

const updateChapter = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, price } = req.body;
        const currentUserId = req.user.userId;

        const updatedChapter = await chapterServices.updateChapter(id, title, currentUserId, price);
        
        res.status(200).json({
            success: true,
            message: "Chapter updated successfully!",
            data: updatedChapter
        });    

    } catch (error) {
        console.error(error);
        if (error.message.includes('Chapter not found')) {
            return res.status(404).json({ error: error.message });
        }
        if (error.message.includes('Not the author')) {
            return res.status(403).json({ error: error.message });
        }
        res.status(500).json({ error: "Something went wrong while updating the chapter." });
    }
};

const deleteChapter = async (req, res) => {
    try {
        const currentUserId = req.user.userId;
        const chapterId = req.params.id;
        await chapterServices.deleteChapter(chapterId, currentUserId);
        
        res.status(200).json({ success: true, message: "Chapter deleted!" });
    } catch (error) {
        console.error(error);
        if (error.message.includes('Chapter not found')) {
            return res.status(404).json({ error: error.message });
        }  
        if (error.message.includes('Not the author')) {
            return res.status(403).json({ error: error.message });
        }
        res.status(500).json({ error: "Something went wrong while deleting the chapter." });
    }
};

module.exports = {
    createChapter,
    getChaptersByBook,
    getChapterById,
    updateChapter,
    deleteChapter
};