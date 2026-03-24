const viewsServices = require('../services/viewsServices');
const catchAsync = require('../middlewares/catchAsync');

const addView = catchAsync(async (req, res) => {

const {bookId} = req.params;
const currentUserId = req.user ? req.user.userId : null;

const wasAdded = await viewsServices.addView(bookId, currentUserId);

res.status(200).json({
    success: true,
    message: wasAdded ? "View added successfully!" : "View not added (guest or already viewed)."});

});

const getViews = catchAsync(async (req, res) => {

const {bookId} = req.params;
const currentUserId = req.user ? parseInt(req.user.userId) : null;
const views = await viewsServices.getViews(bookId, currentUserId);

res.status(200).json({
    success: true,
    count: views.length,
    data: views});

});

module.exports = {
    addView,
    getViews
};