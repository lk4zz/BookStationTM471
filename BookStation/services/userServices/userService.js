const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const NotFoundError = require('../../errors/NotFoundError');

const getUserProfileById = async (userId) => {

    //fetch the data about the user needed for profile
    //can be used through a public function for fetch author or something but for now keep it
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

//can be set with restrictions and used for admin dashboard instead of the service made for admins
const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            bio: true,
            profileImage: true,
            roleId: true,
        },
    });
    return users;
};

//fuzzy search for admin dashboard and explore page
const searchUsers = async (rawQuery, rawLimit) => {
    const q = (rawQuery || "").trim();
    if (q.length < 2) return [];
    const take = Math.max(1, Math.min(parseInt(rawLimit, 10) || 10, 25));
    return prisma.user.findMany({
        where: {
            name: { contains: q },
        },
        take,
        select: { id: true, name: true, profileImage: true, bio: true },
    });
};

module.exports = { getUserProfileById, updateUserProfile, getAllUsers, searchUsers };