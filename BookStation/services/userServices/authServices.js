const bcrypt = require("bcrypt");
const prisma = require("../../db");
const jwt = require("jsonwebtoken");
const BadRequestError = require("../../errors/BadRequestError");
const ForbiddenError = require("../../errors/ForbiddenError");
const { BANNED_MESSAGE } = require("../../middlewares/checkBanned");
const JWT_SECRET = process.env.JWT_SECRET;

const signupUser = async (name, email, password) => {
  try {
    //check if the email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      throw new BadRequestError("Email is already in use");
    }

    //hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

     //create a new user if email isnt registered
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        roleId: 1,
      },
    });

    //generate the token using secret key in env file and add expiration date
    // The payload keys are 'userId' 'roleId' used as req.user.userId/roleId
    const token = jwt.sign(
      { userId: newUser.id, roleId: newUser.roleId },
      JWT_SECRET,
      { expiresIn: "48h" }
    );
    return { newUser, token };
  } catch (err) {
    console.log(err); //log errors for debugging
    throw err;
  }
};

const loginUser = async (email, password) => {
  try {

    //check if email exists
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new BadRequestError("Email isnt registered");
    }

    //check the password by bycrypting the input and comparing
    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      throw new BadRequestError("Incorrect password");
    }

    //check if user is banned (in case of ban display banned_message and kick them out)
    if (user.isBanned) {
      const err = new ForbiddenError(BANNED_MESSAGE);
      err.banned = true;
      throw err;
    }

    // same payload keys 
    const token = jwt.sign(
      { userId: user.id, roleId: user.roleId },
      JWT_SECRET,
      { expiresIn: "48h" }
    );
    return { user, token };
  } catch (err) {
    console.log(err);
    throw err;
  }
};


module.exports = { signupUser, loginUser };