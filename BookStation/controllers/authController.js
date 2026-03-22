const authServices = require('../services/authServices');
const catchAsync = require('../middlewares/catchAsync');

const signup = catchAsync(async (req, res) => {

        const { name, email, password } = req.body;
        
        const { newUser, token } = await authServices.signupUser(name, email, password);

        res.status(201).json({
            message: "Account created successfully!",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            },
            token: token
        });

});

const login = catchAsync(async (req, res) => {
 
        const { email, password } = req.body;

        const { user, token } = await authServices.loginUser(email, password);

        res.status(200).json({
            message: "Login successful!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                roleId: user.roleId
            },
            token: token
        });

});

module.exports = { signup, login };