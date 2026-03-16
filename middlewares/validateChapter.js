const BadRequestError = require('../errors/BadRequestError');

const validateChapter = async (req, res, next) => {
    let { title, requestedPrice } = req.body;

    if (!title) {
        return next(new BadRequestError("Title is required"));
    }
    
    if (typeof title !== 'string' || title.trim().length === 0) {
        return next(new BadRequestError("Title must be a non-empty string"));
    }

    if (title.length > 200) {
        return next(new BadRequestError("Title must be less than 200 characters"));
    }

    if (requestedPrice !== undefined) {
        if (typeof requestedPrice !== 'number') {
            return next(new BadRequestError("Price must be a valid number"));
        }

        if (requestedPrice < 0) {
            return next(new BadRequestError("Price cannot be a negative number"));
        }
    }

    req.body.title = title.trim().toLowerCase().replace(/\s+/g, '');

    next();
};

module.exports = validateChapter;