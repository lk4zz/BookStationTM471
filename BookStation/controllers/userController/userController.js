const userService = require('../../services/userServices/userService');
const prisma = require('../../db');
const catchAsync = require('../../middlewares/catchAsync');

const getUserProfileById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await userService.getUserProfileById(id);
    res.status(200).json(user);
});

const updateUserProfile = catchAsync(async (req, res) => {
    const { bio, name } = req.body;
    const currentUserId = req.user.userId;

    let profileImagePath = undefined;
    if (req.file) {

        // normalise backslashes (Windows) and keep it as it is (ma byaaml error mn el backslashes)
        profileImagePath = req.file.path.replace(/\\/g, '/');
    }

    const updatedUser = await userService.updateUserProfile(profileImagePath, bio, currentUserId, name);
    res.status(200).json(updatedUser);
});


const getCurrentUser = catchAsync(async (req, res) => {
    const currentUserId = parseInt(req.user.userId, 10);
    const currentUser = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: {
            id: true,
            name: true,
            aiAccessExpires: true,
            bio: true,
            roleId: true,
            profileImage: true,
        },
    });
    res.status(200).json(currentUser);
});

module.exports = { getUserProfileById, updateUserProfile, getCurrentUser };