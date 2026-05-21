const prisma = require("../../db");
const NotFoundError = require("../../errors/NotFoundError");
const { isAdminRole } = require("../checkers/checkUserRole");

//this function checks if the user has access to read the chapter otherwise it is locked
const checkAccess = async (chapterId, currentUserId, currentUserRoleId = null) => {
  //fetch the chapter from db
  const chapter = await prisma.chapters.findUnique({
    where: { id: parseInt(chapterId) },
    include: {
      book: {
        select: { userId: true, status: true }
      }
    },
  });

  if (!chapter) return { hasAccess: false, reason: "not_found" };

  //variables to check role/state of the user
  const loggedInUserId = currentUserId ? parseInt(currentUserId) : null;
  const isAuthor = loggedInUserId ? chapter.book.userId === loggedInUserId : false;
  const isAdmin = isAdminRole(currentUserRoleId);
  const isFree = chapter.price === 0 || chapter.chapterNum === 1;

  //authors have access to their books wether drafted or locked
  if (isAuthor) return { hasAccess: true, chapter };

  //if the user isnt author and the book isnt published then no access to chapters 
  // (even if the chapter is published if the book is draft then no access this is a double security)
  if (chapter.book.status === "DRAFT")
    return { hasAccess: false, reason: "Book isnt found", chapter };

  //if chapter is not published then no access
  if (!chapter.isPublished) return { hasAccess: false, reason: "Chapter isnt found", chapter };

  //business rule, if the user is guest and the chapter is not chapter 1 then no access until log in
  if (!loggedInUserId) {
    if (chapter.chapterNum === 1) return { hasAccess: true, chapter };
    else return { hasAccess: false, reason: "Login_required", chapter };
  }

  // if the user is logged and and is admin then immediate access
  // it is placed here because admins cant see drafts (policy rule for privacy)
  if (isAdmin) return { hasAccess: true, chapter };

  //if the user is logged in and isnt admin and the chapter is free they have access
  if (isFree) return { hasAccess: true, chapter };

  //if chapter isnt free and all the aboce is bypassed
  //fetch reciept if the user bought the chapter
  const receipt = await prisma.chapterUnlocks.findFirst({
    where: { userId: loggedInUserId, chapterId: parseInt(chapterId) },
  });

  //if there is a receipt then user has access
  if (receipt) return { hasAccess: true, chapter };

  //if there is no receipt then no access until user pays
  return { hasAccess: false, reason: "payment_required", chapter };
};

module.exports = { checkAccess };
