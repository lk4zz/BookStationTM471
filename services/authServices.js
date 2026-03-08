const bcrypt = require('bcrypt');
const prisma = require('../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const signupUser = async (name, email, password) => {
    const existingUser = await prisma.user.findUnique({
        where: { email: email }
    });

    if (existingUser) {
        throw new Error("Email is already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            roleId: 1,
        }
    });

    const token = jwt.sign(
        { userId: newUser.id },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    return { newUser, token };
};

const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({
        where: { email: email }
    });

    if (!user) {
        throw new Error("Email isnt registered");
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    
    if (!passwordCheck) {
        throw new Error("Incorrect password");
    }

    const token = jwt.sign(
        { userId: user.id },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    return { user, token };
};

module.exports = { signupUser, loginUser };