const { get } = require('http');
const pageServices = require('../services/pageServices');
const catchAsync = require('../middlewares/catchAsync');

const createPage = catchAsync(async (req, res) => {

        const currentUserId = req.user.userId;
        const {chapterId} = req.params;
        const { text } = req.body;

        const newPage = await pageServices.createPage(chapterId, text, currentUserId);

        res.status(201).json({
            message: "Page created successfully!",
            page: newPage
        });


});


const updatePage = catchAsync(async (req, res) => {
    

        const currentUserId = req.user.userId;
        const {chapterId} = req.params;
        const { text } = req.body;
        const pageId = req.params.id;

        const updatePage = await pageServices.updatePage(chapterId, text, currentUserId, pageId);
        res.status(200).json({
            message: "Page updated successfully!",
            page: updatePage
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

const deletePage = catchAsync(async (req, res) => {

    const PageId = req.params.id;
    const currentUserId = req.user.userId;
    await pageServices.deletePage(PageId, currentUserId);
    res.status(200).json({
        success: true,
        message: "Page deleted successfully!"
        });

});


module.exports = {
    createPage,
    updatePage,
    getPagesByChapter,
    deletePage

}