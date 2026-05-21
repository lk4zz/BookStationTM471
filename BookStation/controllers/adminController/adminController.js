const catchAsync = require("../../middlewares/catchAsync");
const adminServices = require("../../services/adminServices/adminServices");

const getActor = (req) => ({
  userId: req.user.userId,
  roleId: req.user.freshRoleId,
});

//generate the radar of userTaste
const getUserRadar = catchAsync(async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (Number.isNaN(userId)) {
    return res.status(400).json({ error: "Invalid User ID" });
  }

  const radarData = await adminServices.generateUserRadar(userId);

  return res.status(200).json(radarData);
});

// ban users
const banUser = catchAsync(async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (Number.isNaN(userId)) {
    return res.status(400).json({ error: "Invalid User ID" });
  }

  const result = await adminServices.banUser(userId, getActor(req));

  return res.status(200).json({
    success: true,
    message: result.isBanned
      ? `User with ID ${userId} has been suspended.`
      : `User with ID ${userId} has been reinstated.`,
    isBanned: result.isBanned, // status for UI
  });
});

// this also can be removed by using the book services (delete book service)
const deleteBook = catchAsync(async (req, res) => {
  const bookId = parseInt(req.params.bookId, 10);

  if (Number.isNaN(bookId)) {
    return res.status(400).json({ error: "Invalid Book ID" });
  }

  await adminServices.deleteBook(bookId);

  return res.status(200).json({ 
    success: true, 
    message: `Book with ID ${bookId} has been successfully deleted.` 
  });
});

const getAllUsers = catchAsync(async (req, res) => {
    const users = await adminServices.getAllUsers(getActor(req));

    return res.status(200).json({
        success: true,
        count: users.length,
        users: users
    });
});

//Note: leave till this end
// this can be removed by adding restrictions to getAllPublicBooks
const getAdminBooks = catchAsync(async (req, res) => {
    const books = await adminServices.getAdminBooks();

    return res.status(200).json({
        success: true,
        count: books.length,
        data: books,
    });
});

const changeUserRole = catchAsync(async (req, res) => {
    const { userId, roleId } = req.body;
    await adminServices.changeUserRole(userId, roleId, getActor(req));
    return res.status(200).json({
      success: true,
      message: "User role updated successfully!"
    });
    })

const flagBookAndNotify = catchAsync(async (req, res) => {
    const { bookId } = req.params;
    const { message } = req.body;
    const adminId = req.user.userId;

    if (!message) {
        return res.status(400).json({ error: "A message must be provided to the author." });
    }

    await adminServices.adminFlagBookAndNotify(bookId, message, adminId);

    return res.status(200).json({
        success: true,
        message: "Book flagged and author notified successfully."
    });
});

const unflagBook = catchAsync(async (req, res) => {
    const { bookId } = req.params;
    const { message } = req.body;
    const adminId = req.user.userId;

    let notificationMessage = message;
    if (!notificationMessage) {
        notificationMessage = "Your book has been reviewed and restored to the platform.";
    }

    await adminServices.adminUnflagBook(bookId, notificationMessage, adminId);

    return res.status(200).json({
        success: true,
        message: "Book unflagged and author notified."
    });
});

const getReviewQueue = catchAsync(async (req, res) => {
    const queue = await adminServices.getReviewQueue();

    return res.status(200).json({
        success: true,
        count: queue.length,
        data: queue
    });
});

const sendFeedbackAgain = catchAsync(async (req, res) => {
    const { bookId } = req.params;
    const { message } = req.body;
    const adminId = req.user.userId;

    if (!message) {
        return res.status(400).json({ error: "A feedback message must be provided." });
    }

    await adminServices.adminSendFeedbackAgain(bookId, message, adminId);

    return res.status(200).json({
        success: true,
        message: "Feedback sent to author and book returned for revision."
    });
});

module.exports = { 
    getUserRadar, 
    banUser, 
    deleteBook,
    getAllUsers,
    getAdminBooks,
    changeUserRole,
    flagBookAndNotify,
    getReviewQueue,
    unflagBook,
    sendFeedbackAgain,
};