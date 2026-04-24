const genreService = require('../../services/adminServices/genreServices');
const catchAsync = require('../../middlewares/catchAsync');

const createGenre = catchAsync(async (req, res) => {
    try {
        const { type } = req.body;
        
        // A mini-bouncer right inside the Waiter to ensure they didn't send an empty request
        if (!type || typeof type !== 'string' || type.trim().length === 0) {
            return res.status(400).json({ error: "Genre type is required and must be a string." });
        }

        const newGenre = await genreService.createGenre(type);
        
        res.status(201).json({ 
            message: "Genre created successfully!", 
            genre: newGenre 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong while creating the genre." });
    }
});

const getAllGenres = catchAsync(async (req, res) => {
    try {
        const genres = await genreService.getAllGenres();
        res.status(200).json(genres);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong while fetching genres." });
    }
});

module.exports = {
    createGenre,
    getAllGenres
};
