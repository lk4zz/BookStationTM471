const bcrypt = require("bcrypt");
const prisma = require("../db");
const jwt = require("jsonwebtoken");
const BadRequestError = require("../errors/BadRequestError");
const JWT_SECRET = process.env.JWT_SECRET;

const signupUser = async (name, email, password) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      throw new BadRequestError("Email is already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        roleId: 1,
      },
    });

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
      expiresIn: "24h",
    });
    return { newUser, token };
  } catch (err) {
    console.log(err); 
    throw err;
  }
};



const loginUser = async (email, password) => {
  try {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    throw new BadRequestError("Email isnt registered");
  }

  const passwordCheck = await bcrypt.compare(password, user.password);

  if (!passwordCheck) {
    throw new BadRequestError("Incorrect password");
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "24h" });

  return { user, token };
  } catch (err) {
    console.log(err); 
    res.status(500).json({ error: err.message });
  }
};

module.exports = { signupUser, loginUser };
