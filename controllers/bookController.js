const prisma = require('../db');


const createBook = async (req, res) => {
    try {
        const { title, description, price} = req.body;
        const existingBook = await prisma.books.findUnique({
            where: {name: title}
        });

        if (existingBook) {
        return res.status(400).json({error: "A book with this title already exists. Please choose a different title."});
    }
        const authorId = req.user.userId;



        const newBook = await prisma.books.create({
            data: 
            {
                name: title,
                description: description || "",
                price: price ?? 0,
                userId: authorId,
                views: 0,
                rating: 0
            }
        })

        res.status(201).json({
            message: "Book published successfully!",
            book: newBook
            });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong while publishing the book." });
    }
};

module.exports = {
    createBook
};