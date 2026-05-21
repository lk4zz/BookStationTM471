const prisma = require("../db");
const ForbiddenError = require("../errors/ForbiddenError");

//these functions checks a book has bought chapters or a if a chapter is bought through a receipt row
//if any user buys a chapter in a book
//the book cannot be drafted nor deleted 
//the chapter cannot be deleted 
//incase of a moderation case the chapter can be editing in await author state but it cannot be deleted
//this way the author is forced to edit the chapter thus keeping the users their promised product without
// a complicated refund loop that is bad for performance and might crash the server
//final note: if admins delete a book it is in the policy that no refunds will happen

const checkBookReceipts = async (bookId) => {
  //fetch the chapters
  const chapters = await prisma.chapters.findMany({
    where: { bookId: parseInt(bookId) },
  });

  //map out the chapter IDs of the book
  const chapterIds = chapters.map((chapters) => chapters.id);

  //check for atleast one receipt (findfirst)
  const receipt = await prisma.chapterUnlocks.findFirst({
    where: {
      chapterId: { in: chapterIds },
    },
  });
  //if there is a receipt block deletion or drafting of book
  if (receipt) {
    throw new ForbiddenError("THIS BOOK HAS BOUGHT CHAPTERS ALREADY CANNOT DRAFT NOR DELETE");
  }
};

//this is chapter specific (check if there are any receipts for a specific chapter)
const checkChapterRreceipt = async (chapterId) => {

  //check for atleast one receipt for a specfic chapter (findfirst)
  const receipt = await prisma.chapterUnlocks.findFirst({
    where: { chapterId: parseInt(chapterId) }
  })
  //if there is a receipt block deletion
  //chapters cannot be unpublished anyway
  if (receipt) {
    throw new ForbiddenError("THIS CHAPTER HAS PAYMENT RECEIPTS CANNOT DELETE");
  }
}

module.exports = {
  checkBookReceipts,
  checkChapterRreceipt
}