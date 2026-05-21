const { ROLE } = require("../checkers/checkUserRole");
const { BANNED_MESSAGE } = require("../../middlewares/checkBanned");

// this file is consisted of functions that help set notification titles and messages
// for certain admin actions to clean the admin services file

//this is a banned notification for user when they get banned 
// problem: user wont see the notifcation cuz they will be kicked but it will still show
// when the user is trying to log in
const getBanNotification = (isBanned) => {
    return {
        title: "Account status",
        message: isBanned ? BANNED_MESSAGE : "Your account has been reinstated."
    };
};

//updating users role from reader to author or even admin will notify the user
const getRoleUpdateNotification = (oldRoleId, newRoleId) => {
    let message = "Your role has been updated.";
    
    //using the ROLE checker from checkUserRole to see waht the new role is to decide the message
    if (newRoleId === ROLE.READER) {
        if (oldRoleId === ROLE.ADMIN) message = "Your admin access has been revoked.";
        else if (oldRoleId === ROLE.AUTHOR) message = "Your author access has been revoked.";
    } else if (newRoleId === ROLE.AUTHOR) {
        if (oldRoleId === ROLE.ADMIN) message = "Your role has been changed to Author.";
        else message = "Your author access has been granted.";
    } else if (newRoleId === ROLE.ADMIN) {
        message = "Your admin access has been granted.";
    }

    return { title: "Account update", message };
};

//book moderation notification incase of a flag the message is costum but the title is static
//admins can write costume messages for flaggin
//system flags are static messages and the book is underreview immediately incase of false reports
const getModerationNotification = (actionType, customMessage) => {
    const templates = {
        FLAGGED: "Action Required: Book Flagged",
        FEEDBACK: "Action Required: Review Feedback",
        RESTORED: "Book Restored",
    };

    return {
        title: templates[actionType] || "Book Moderation Update",
        message: customMessage
    };
};

module.exports = {
    getBanNotification,
    getRoleUpdateNotification,
    getModerationNotification
};