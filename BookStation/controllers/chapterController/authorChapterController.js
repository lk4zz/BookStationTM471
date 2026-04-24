const chapterServices = require('../../services/chapterServices/authorChapterServices');
const catchAsync = require('../../middlewares/catchAsync');

const createChapter = catchAsync(async (req, res) => {
    const { bookId } = req.params;
    const { title } = req.body;
    const currentUserId = req.user.userId;

    const newChapter = await chapterServices.createChapter(bookId, title, currentUserId);

    res.status(201).json({
        success: true,
        message: "Chapter created successfully!",
        data: newChapter
    });
});

const updateChapter = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { title, price } = req.body;
    const currentUserId = req.user.userId;

    const updatedChapter = await chapterServices.updateChapter(id, title, currentUserId, price);

    res.status(200).json({
        success: true,
        message: "Chapter updated successfully!",
        data: updatedChapter
    });
});

const publishChapter = catchAsync(async (req, res) => {
    const chapterId = req.params.id;
    const currentUserId = req.user.userId;
    const { price } = req.body;

    const publishedChapter = await chapterServices.publishChapter(
        chapterId,
        currentUserId,
        price
    );

    res.status(200).json({
        success: true,
        message: `Chapter successfully published${publishedChapter.isLocked ? ` and locked for ${publishedChapter.price} coins` : ' for free'}!`,
        data: publishedChapter
    });
});

const deleteChapter = catchAsync(async (req, res) => {
    const currentUserId = req.user.userId;
    const chapterId = req.params.id;

    await chapterServices.deleteChapter(chapterId, currentUserId);

    res.status(200).json({
        success: true,
        message: "Chapter deleted!"
    });
});

module.exports = {
    createChapter,
    updateChapter,
    deleteChapter,
    publishChapter,
};