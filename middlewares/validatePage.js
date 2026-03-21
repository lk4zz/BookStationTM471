const validatePage = async (req, res, next) => {
    let {text} = req.body;
    if (!text) {
        return res.status(400).json({error: "text is required"})
    }

    if(typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({error: "text must be a non empty string"})
    }
    if (text.length > 5000) {
        return res.status(400).json({error: "text must be less than 5,000 characters"})
    }
    next();

}

module.exports = validatePage;