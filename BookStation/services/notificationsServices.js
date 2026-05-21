const prisma = require("../db");

const createNotification = async (userId, title, message) => {
  //grab message, userId(the user that will be notified), and a title from the controller
  const parsedUserId = parseInt(userId, 10);
  //create notification row using the parameters
  const notifcation = await prisma.notifications.create({
    data: {
      userId: parsedUserId,
      title: title,
      message: message,
      isRead: false,
    },
  })

}

const getNotificationsByUserId = async (userId) => {
  //simply fetch the notification that are not read
  return await prisma.notifications.findMany({
    where: {
      userId,
      isRead: false
    },
    orderBy: { createdAt: 'desc' }
  });
};

const updateNotificationToRead = async (notificationId, userId) => {
  const parsedUserId = parseInt(userId, 10);
  const parsedNotificationId = parseInt(notificationId, 10);

  //update the state of the notifcation to be read
  return await prisma.notifications.update({
    where: {
      id: parsedNotificationId,
      userId: parsedUserId
    },
    data: { isRead: true }
  });
};

module.exports = { createNotification, getNotificationsByUserId, updateNotificationToRead };