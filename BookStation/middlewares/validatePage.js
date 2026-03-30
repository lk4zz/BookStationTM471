const MAX_HTML_LENGTH = 10 * 1024 * 1024;

const validatePage = async (req, res, next) => {
  let { text } = req.body;
  if (text === undefined || text === null) {
    return res.status(400).json({ error: "text is required" });
  }

  if (typeof text !== "string") {
    return res.status(400).json({ error: "text must be a string" });
  }

  if (text.trim().length === 0) {
    return res.status(400).json({ error: "text must be a non empty string" });
  }

  if (text.length > MAX_HTML_LENGTH) {
    return res.status(400).json({ error: "text exceeds maximum length" });
  }
  next();
};

/** For Tiptap HTML chapter saves: allows empty document, same max as express json. */
const validatePrimaryPageHtml = (req, res, next) => {
  const { text } = req.body;
  if (text === undefined || text === null) {
    return res.status(400).json({ error: "text is required" });
  }
  if (typeof text !== "string") {
    return res.status(400).json({ error: "text must be a string" });
  }
  if (text.length > MAX_HTML_LENGTH) {
    return res.status(400).json({ error: "text exceeds maximum length" });
  }
  next();
};

module.exports = validatePage;
module.exports.validatePrimaryPageHtml = validatePrimaryPageHtml;
