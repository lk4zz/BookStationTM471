const catchAsync = require("../../middlewares/catchAsync");
const adminServices = require("../../services/adminServices/adminServices"); 

const getUserRadar = catchAsync(async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (Number.isNaN(userId)) {
    return res.status(400).json({ error: "Invalid User ID" });
  }

  // No auth / ownership check — testing & demos only; lock down before production.
  const radarData = await adminServices.generateUserRadar(userId);

  return res.status(200).json(radarData);
});

const banUser = catchAsync(async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (Number.isNaN(userId)) {
    return res.status(400).json({ error: "Invalid User ID" });
  }

  // Call the service to delete the user
  await adminServices.banUser(userId);

  return res.status(200).json({ 
    success: true, 
    message: `User with ID ${userId} has been successfully deleted/banned.` 
  });
});

const deleteBook = catchAsync(async (req, res) => {
  const bookId = parseInt(req.params.bookId, 10);

  if (Number.isNaN(bookId)) {
    return res.status(400).json({ error: "Invalid Book ID" });
  }

  // Call the service to delete the book
  await adminServices.deleteBook(bookId);

  return res.status(200).json({ 
    success: true, 
    message: `Book with ID ${bookId} has been successfully deleted.` 
  });
});

const getAllUsers = catchAsync(async (req, res) => {
    const users = await adminServices.getAllUsers();
    
    return res.status(200).json({
        success: true,
        count: users.length,
        users: users
    });
});

const changeUserRole = catchAsync(async (req, res) => {
    const { userId, roleId } = req.body;
    await adminServices.changeUserRole(userId, roleId);
    return res.status(200).json({
      success: true,
      message: "User role updated successfully!"
    });
    })

module.exports = { 
    getUserRadar, 
    banUser, 
    deleteBook,
    getAllUsers,
    changeUserRole,
};