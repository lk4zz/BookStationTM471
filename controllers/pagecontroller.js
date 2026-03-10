const { get } = require('http');
const pageServices = require('../services/pageServices');

const createPage = async (req, res) => {
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
};


const updatePage = async (req, res) => {
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
}

getPagesByChapter = async (req, res) => {
    try {
    const ChapterId = req.params.chapterId;
    const pages = await pageServices.getPagesByChapter(ChapterId);
    res.status(200).json({
        success: true,
        count: pages.length,
        data: pages
        });
    } catch (error) {
        console.error(error);
        if (error.message === "Chapter not found") {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === "This chapter has no pages.") {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: "Something went wrong while fetching the pages." });
    }
};

const deletePage = async (req, res) => {
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


}


module.exports = {
    createPage,
    updatePage,
    getPagesByChapter,
    deletePage

}