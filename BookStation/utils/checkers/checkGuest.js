const { parse } = require("path");
const prisma = require("../../db");

//this function checks if the user is guest (doesnt have a token) or a user (has a token)
const isGuest = async (userId) => {
    //check if there is an id from req.user.userId (taken from token if found)
    const loggedInUserId = userId ? parseInt(userId) : null;
    //if there is an id fetch it to check and isGuest is false
    if (loggedInUserId) {
        const user = await prisma.user.findUnique({
            where: { id:  parseInt(userId)}
        })
        return { isGuest: false, user };
    }
    return { isGuest: true };

};

module.exports = {
    isGuest
};