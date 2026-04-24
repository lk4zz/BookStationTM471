const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const NotFoundError = require('../../errors/NotFoundError');

const getUserProfileById = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: parseInt(userId, 10) },
        select: {
            id: true,
            name: true,
            bio: true,
            profileImage: true,
        },
    });

    if (!user) throw new NotFoundError("Author not found");
    return user;
};

const updateUserProfile = async (profileImage, bio, currentUserId, name) => {
    const existingUser = await prisma.user.findUnique({
        where: { id: currentUserId },
    });

    if (!existingUser) throw new NotFoundError("User not found");

    // If no new image was uploaded, keep whatever is already in the DB.
    let normalizedImage = existingUser.profileImage;
    if (profileImage) {
        const clean = profileImage.replace(/\\/g, '/');  //hay ensures clean path
        normalizedImage = clean.startsWith('/') ? clean : `/${clean}`;  //hay ensure / included in path
    }

    const updatedUser = await prisma.user.update({
        where: { id: currentUserId },
        data: {
            profileImage: normalizedImage,
            bio: bio ?? existingUser.bio,  //check if new changes if not fallback to old one
            name: name ?? existingUser.name,
        },
        select: {
            id: true,
            name: true,
            bio: true,
            profileImage: true,
            coinBalance: true,
        },
    });

    return updatedUser;
};


module.exports = { getUserProfileById, updateUserProfile };