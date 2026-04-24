const pageServices = require('../services/pageServices');
const catchAsync = require('../middlewares/catchAsync');

const getPagesForAuthor = catchAsync(async (req, res) => {
    const chapterId = req.params.chapterId;
    const currentUserId = req.user.userId;
    const data = await pageServices.getPagesForAuthor(chapterId, currentUserId);
    res.status(200).json({
        success: true,
        count: data.pages.length,
        data,
    });
});

const upsertPrimaryPage = catchAsync(async (req, res) => {
    const chapterId = parseInt(req.params.chapterId);
    const currentUserId = req.user.userId;
    const { text } = req.body;
    const page = await pageServices.upsertPrimaryPage(chapterId, text, currentUserId);
    res.status(200).json({
        success: true,
        message: "Chapter content saved.",
        page,
    });
});

const getPagesByChapter = catchAsync(async (req, res) => {
   
    const ChapterId = req.params.chapterId;
    const currentUserId = req.user? req.user.userId : null;
    const pages = await pageServices.getPagesByChapter(ChapterId, currentUserId);
    res.status(200).json({
        success: true,
        count: pages.pages.length,
        data: pages
        });
    
});


module.exports = {
    getPagesByChapter,
    getPagesForAuthor,
    upsertPrimaryPage,
}