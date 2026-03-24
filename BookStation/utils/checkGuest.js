const { parse } = require("path");
const prisma = require("../db");

const isGuest = async (userId) => {
    const loggedInUserId = userId ? parseInt(userId) : null;
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