const BadRequestError = require("../errors/BadRequestError");

const checkEditAccess = async (book) => {
    
    if (book.status === "COMPLETED") throw new BadRequestError("Completed Books cannot be edited.");
}

module.exports = {
    checkEditAccess
}