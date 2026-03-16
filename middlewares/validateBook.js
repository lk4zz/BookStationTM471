const BadRequestError = require('../errors/BadRequestError');

const validateBook = async (req, res, next) => {
    let { title, description, price } = req.body;

    // 1. Check existence and type first to prevent TypeErrors
    if (!title) {
        return next(new BadRequestError("Title is required."));
    }
    
    if (typeof title !== 'string' || title.trim().length === 0) {
        return next(new BadRequestError("Title must be a non-empty string."));
    }

    const hasLetters = /[a-zA-Z]/.test(title);
    if (!hasLetters) {
        return next(new BadRequestError("Title must contain at least one alphabetical letter."));
    }

    if (title.length > 200) {
        return next(new BadRequestError("Title must be less than 200 characters."));
    }

    if (description && description.length > 1000) {
        return next(new BadRequestError("Description must be less than 1000 characters."));  
    }

    if (price !== undefined && price !== null) {
        if (typeof price !== 'number') {
            return next(new BadRequestError("Price must be a valid number."));
        }

        if (price < 0) {
            return next(new BadRequestError("Price cannot be a negative number."));
        }
    }
    
    req.body.title = title.trim().toLowerCase().replace(/\s+/g, '');
    
    if (description) {
        req.body.description = description.trim();
    }

    next();
};

module.exports = validateBook;