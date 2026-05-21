// controllers/notificationController.js
const notificationService = require('../services/notificationsServices')
const catchAsync = require('../middlewares/catchAsync');

const getUserNotifications = catchAsync(async (req, res) => {
  const userId = req.user.userId; 
  
  const notifications = await notificationService.getNotificationsByUserId(userId);
  
  res.status(200).json({
    success: true,
    data: notifications
  });
});

// PATCH /api/notifications/:id/read
const markNotificationAsRead = catchAsync(async (req, res) => {
  const notificationId = req.params.id;
  const userId = req.user.userId;

  const updatedNotification = await notificationService.updateNotificationToRead(
    notificationId, 
    userId
  );

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
    data: updatedNotification
  });
});

module.exports = {
  getUserNotifications,
  markNotificationAsRead
};