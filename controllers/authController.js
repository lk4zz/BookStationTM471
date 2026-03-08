const authServices = require('../services/authServices');

const signup = async (req, res) => {
    try {
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

    } catch (error) {
        if (error.message === "Email is already in use") {
            return res.status(400).json({ error: error.message });
        }
        console.error(error);
        res.status(500).json({ error: "Something went wrong creating the account." });
    }
};

const login = async (req, res) => {
    try {
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

    } catch (error) {
        if (error.message === "Email isnt registered" || error.message === "Incorrect password") {
            return res.status(400).json({ error: error.message });
        }
        console.error(error);
        res.status(500).json({ error: "Something went wrong during login." });
    }
};

module.exports = { signup, login };