const userService = require('../services/userService');
const catchAsync = require('../middlewares/catchAsync');

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

module.exports = { getUserProfileById, updateUserProfile };