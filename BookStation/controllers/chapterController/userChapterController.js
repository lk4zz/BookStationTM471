const chapterServices = require('../../services/chapterServices/userChapterServices');
const catchAsync = require('../../middlewares/catchAsync');

const getChaptersByBook = catchAsync(async (req, res) => {
    const bookId = parseInt(req.params.bookId, 10);
    const currentUserId = req.user ? req.user.userId : null;

    const chapters = await chapterServices.getChaptersByBook(bookId, currentUserId);

    res.status(200).json({
        success: true,
        count: chapters.length,
        data: chapters
    });
});

const getChapterById = catchAsync(async (req, res) => {
    const { chapterId } = req.params;
    const userId = req.user ? req.user.userId : null;

    const chapter = await chapterServices.getChapterById(chapterId, userId);

    res.status(200).json({
        success: true,
        data: chapter
    });
});

const unlockChapter = catchAsync(async (req, res) => {
    const chapterId = req.params.id;
    const currentUserId = req.user.userId;

    const { updatedUserWallet } = await chapterServices.unlockChapter(currentUserId, chapterId);

    res.status(200).json({
        success: true,
        message: "Chapter successfully unlocked! Happy reading.",
        data: {
            newCoinBalance: updatedUserWallet.coinBalance
        }
    });
});

module.exports = {
    getChaptersByBook,
    getChapterById,
    unlockChapter,
};