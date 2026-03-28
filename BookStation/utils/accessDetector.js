const prisma = require("../db");
const NotFoundError = require("../errors/NotFoundError");

const checkAccess = async (chapterId, currentUserId) => {
  const chapter = await prisma.chapters.findUnique({
    where: { id: parseInt(chapterId) },
    include: {
      book: {
        select: { userId: true }
      }
    },
  });

  if (!chapter) return { hasAccess: false, reason: "not_found" };

  const loggedInUserId = currentUserId ? parseInt(currentUserId) : null;
  const isAuthor = loggedInUserId ? chapter.book.userId === loggedInUserId : false;
  const isFree = chapter.price === 0 || chapter.chapterNum === 1;

  if (isAuthor) return { hasAccess: true, chapter };

  if (!chapter.isPublished) return { hasAccess: false, reason: "not_published", chapter };

  if (!loggedInUserId) {
    if (chapter.chapterNum === 1) return { hasAccess: true, chapter };
    else return { hasAccess: false, reason: "Login_required", chapter };
  }

  if (isFree) return { hasAccess: true, chapter };

  const receipt = await prisma.chapterUnlocks.findFirst({
    where: { userId: loggedInUserId, chapterId: parseInt(chapterId) },
  });

  if (receipt) return { hasAccess: true, chapter };

  return { hasAccess: false, reason: "payment_required", chapter };
};

module.exports = { checkAccess };
