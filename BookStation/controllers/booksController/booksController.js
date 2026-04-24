const authorBooksController = require("./authorBooksController");
const userBooksController = require("./userBooksController");

module.exports = {
  ...authorBooksController,
  ...userBooksController,
};