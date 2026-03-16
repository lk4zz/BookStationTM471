const { get } = require('http');
const pageServices = require('../services/pageServices');
const catchAsync = require('../middlewares/catchAsync');

const createPage = catchAsync(async (req, res) => {
    try{
        const currentUserId = req.user.userId;
        const {chapterId} = req.params;
        const { text } = req.body;

        const newPage = await pageServices.createPage(chapterId, text, currentUserId);

        res.status(201).json({
            message: "Page created successfully!",
            page: newPage
        });

    } catch(error) {

        console.error(error);
        if (error.message === "Chapter not found") {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === "You are not the author of this book.") {
            return res.status(403).json({ error: error.message });
        }
        res.status(500).json({ error: "Something went wrong while creating the page." });

    };
});


const updatePage = catchAsync(async (req, res) => {
    try{

        const currentUserId = req.user.userId;
        const {chapterId} = req.params;
        const { text } = req.body;
        const pageId = req.params.id;

        const updatePage = await pageServices.updatePage(chapterId, text, currentUserId, pageId);
        res.status(200).json({
            message: "Page updated successfully!",
            page: updatePage
        });


    } catch(error) {
        console.error(error);
        if (error.message === "Chapter not found") {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === "You are not the author of this book.") {
            return res.status(403).json({ error: error.message });
        }
        res.status(500).json({ error: "Something went wrong while updating the page." });

    }
});

const getPagesByChapter = catchAsync(async (req, res) => {
    try {
    const ChapterId = req.params.chapterId;
    const currentUserId = req.user ? req.user.userId : null;
    const pages = await pageServices.getPagesByChapter(ChapterId, currentUserId);
    res.status(200).json({
        success: true,
        count: pages.pages.length,
        data: pages
        });
    } catch (error) {
        console.error(error);
        let statusCode = 500;
        
        if (error.message === "Chapter not found" || error.message === "This chapter has no pages.") {
            statusCode = 404;
        } else if (error.message === "Chapter is not published") {
            statusCode = 403; // Forbidden
        } else if (error.message === "Log in required.") {
            statusCode = 401; // Unauthorized
        } else if (error.message.includes("Payment Required")) {
            statusCode = 402; // Payment Required
        }

        res.status(statusCode).json({ success: false, error: error.message });
    }
});

const deletePage = catchAsync(async (req, res) => {
    try {
    const PageId = req.params.id;
    const currentUserId = req.user.userId;
    await pageServices.deletePage(PageId, currentUserId);
    res.status(200).json({
        success: true,
        message: "Page deleted successfully!"
        });


    } catch (error) {
        console.error(error);
        if (error.message === "Page not found") {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === "You are not the author of this book.") {
            return res.status(403).json({ error: error.message });
        }
        res.status(500).json({ error: "Something went wrong while deleting the page." });


    }


});


module.exports = {
    createPage,
    updatePage,
    getPagesByChapter,
    deletePage

}