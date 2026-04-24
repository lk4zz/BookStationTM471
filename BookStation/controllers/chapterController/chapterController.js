const authorChapterController = require("./authorChapterController");
const userChapterController = require("./userChapterController");

module.exports = {
  ...authorChapterController,
  ...userChapterController,
};