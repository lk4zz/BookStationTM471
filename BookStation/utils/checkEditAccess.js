const BadRequestError = require("../errors/BadRequestError");

const checkEditAccess = async (book) => {
    console.log("TESTING PAGEEDITS")
    if (book.status === "COMPLETED") throw new BadRequestError("Completed Books cannot be edited.");
}

const checkChapterEditAccess = async (chapter) => {
    if (chapter.isPublished) throw new BadRequestError("Published Chapters cannot be edited.");
}

module.exports = {
    checkEditAccess,
    checkChapterEditAccess

}