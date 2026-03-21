const prisma = require('../db');

const createGenre = async (type) => { 
    const newGenre = await prisma.genre.create({
        data: { type: type.toLowerCase().trim() }
    });
    return newGenre;
    
}

const getAllGenres = async () => {
    const genres = await prisma.genre.findMany();
    return genres;
};

module.exports = {
    createGenre,
    getAllGenres
};