const commentServices = require('../../services/interactionServices/commentServices');
const catchAsync = require('../../middlewares/catchAsync');

const commentOnBook = catchAsync(async(req, res) => {
    try {
        const { bookId } = req.params;
        const currentUserId = req.user.userId;
        const { comment } = req.body;
        const commentOnbook = await commentServices.commentOnBook(bookId, currentUserId, comment);
        res.status(201).json({
            message: "Comment added successfully!",
            comment: commentOnbook
        })
        

    } catch(error) {
        console.error(error);
        if (error.message === "Comment cannot be empty") {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Something went wrong while commenting on the book." });

    }
});


const getCommentsByBook = catchAsync(async (req, res) => {
    try {
        const { bookId } = req.params;
        const comments = await commentServices.getCommentsByBook(bookId);
        res.status(200).json({
            success: true,
            count: comments.length,
            data: comments
        });


    } catch(error) {
        console.error(error);
        if (error.message === "No comments found for this book.") {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: "Something went wrong while fetching the comments." });

    }
});

const deleteComment = catchAsync(async (req, res) => {
    try {
        const { commentId } = req.params;
        const currentUserId = req.user.userId;
        await commentServices.deleteComment(commentId, currentUserId);
        res.status(200).json({
            success: true,
            message: "Comment deleted successfully!"
        });


    } catch (error) {
        console.error(error);
        if (error.message === "Comment not found") {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === "You are not the author of this comment.") {
            return res.status(403).json({ error: error.message });
        }
        res.status(500).json({ error: "Something went wrong while deleting the comment." });


    }
});

module.exports = {
    commentOnBook,
    getCommentsByBook,
    deleteComment,

}; 