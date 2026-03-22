
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateSignup = (req, res, next) => {
    let {name, email, password} = req.body;  //we use let here not const to be able to modify and trim the variables

    if (!name || !email || !password) {
        return next(new BadRequestError("Username, email, and password are required."));
    }
    
    if (password.length < 8 ) {
    return next(new BadRequestError("Password must be at least 8 characters long."));

    }

    name = name.trim();
    if (name.length < 3 || name.length > 30) {
        return next(new BadRequestError("Username must be between 3 and 30 characters long."));
    }   
    
    email = email.trim().toLowerCase();
    if (!emailRegex.test(email)) {
        return next(new BadRequestError("Invalid email format"));
    }

    //Put the clean data BACK into req.body after triming
    req.body.name = name;
    req.body.email = email;

next();

};

const validateLogin = (req, res, next) => {
    let {email, password} = req.body;

    if (!email || !password) {
        return next(new BadRequestError( "email and password are required."));
    }

    //clean the login email so it matches the lowercase one in the database
    email = email.trim().toLowerCase();
    
    if (!emailRegex.test(email)) {
        return next(new BadRequestError("Invalid email format."));
    }

    req.body.email = email;

    next();
};

module.exports = {validateSignup, validateLogin};