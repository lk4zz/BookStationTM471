const prisma = require("../../db");
const { blendTasteProfile } = require("../../services/VectorEmbedServces/tasteService");

const addToLibraryTasteBlender = async (userId, bookId) => {
   const bookData = await prisma.books.findUnique({
      where: { id: bookId },
      select: { embedding: true }
    });

    // check if book has embedding 
    if (bookData && bookData.embedding) {

      const bookVector = JSON.parse(bookData.embedding);

      //weight
      const ADDTOLIBRARY_WEIGHT = 0.3;

      // note: We use 'await' here to ensure it finishes fine shil await hata el front end ma yontor el math
      await blendTasteProfile(userId, bookVector, ADDTOLIBRARY_WEIGHT);
    }
};

module.exports = { addToLibraryTasteBlender };