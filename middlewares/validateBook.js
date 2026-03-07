const validateBook = async (req, res, next) => {


    let { title, description, price} = req.body;
    
    const hasLetters = /[a-zA-Z]/.test(title);
    if (!hasLetters) {
        return res.status(400).json({error: "Title must contain at least one alphabetical letter."});
    }

    if (!title) {
        
        return res.status(400).json({error: "title is required"});
        
    };
    
    if (typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({error: "Title must be a non-empty string"});
    }

    if (title.length > 200) {
        return res.status(400).json({error: "Title must be less than 200 characters"});
    }

    if (description && description.length > 1000) {
        return res.status(400).json({error: "description must be less than 1000 characters"});  
    }

    if (price !== undefined) {
        
        if (typeof price !== 'number') {
            return res.status(400).json({error: "Price must be a valid number"});
        }

        if (price < 0) {
            return res.status(400).json({error: "Price cannot be a negative number"});
        }
    }
    
    req.body.title = title.trim().toLowerCase().replace(/\s+/g, '');
    if (description) {
        req.body.description = description.trim();
    }

    next();
};

module.exports = validateBook;