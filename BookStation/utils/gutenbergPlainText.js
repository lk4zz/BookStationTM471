/**
 * Project Gutenberg plain-text helpers: strip boilerplate, escape HTML, paginate for TipTap-style pages.
 */

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Removes standard Project Gutenberg header/footer from a UTF-8 .txt body.
 * @param {string} raw
 * @returns {string}
 */
function stripGutenbergBoilerplate(raw) {
  let s = raw.replace(/\r\n/g, "\n");

  const startRe = /\*\*\*\s*START OF (?:THE )?PROJECT GUTENBERG EBOOK .+?\*\*\*/i;
  const startMatch = s.match(startRe);
  if (startMatch) {
    s = s.slice(startMatch.index + startMatch[0].length);
  }

  const endRe = /\*\*\*\s*END OF (?:THE )?PROJECT GUTENBERG EBOOK .+?\*\*\*/i;
  const endMatch = s.match(endRe);
  if (endMatch) {
    s = s.slice(0, endMatch.index);
  }

  return s.trim();
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Split cleaned plain text into HTML pages (each page is a sequence of <p>…</p>) for storage in Pages.text.
 * @param {string} cleanText
 * @param {number} wordsPerPage
 * @returns {string[]}
 */
function buildHtmlPagesFromPlainText(cleanText, wordsPerPage = 2500) {
  const paragraphs = cleanText
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const pages = [];
  let buf = [];
  let wc = 0;

  for (const p of paragraphs) {
    const pw = wordCount(p);
    if (wc + pw > wordsPerPage && buf.length > 0) {
      pages.push(buf.map((x) => `<p>${escapeHtml(x)}</p>`).join(""));
      buf = [p];
      wc = pw;
    } else {
      buf.push(p);
      wc += pw;
    }
  }
  if (buf.length) {
    pages.push(buf.map((x) => `<p>${escapeHtml(x)}</p>`).join(""));
  }

  return pages.length > 0 ? pages : ["<p></p>"];
}

/**
 * Canonical cache URL for UTF-8 plain text (works for many ebooks).
 * @param {number} gutenbergId
 * @returns {string}
 */
function gutenbergDefaultTxtUrl(gutenbergId) {
  return `https://www.gutenberg.org/cache/epub/${gutenbergId}/pg${gutenbergId}.txt`;
}

module.exports = {
  escapeHtml,
  stripGutenbergBoilerplate,
  wordCount,
  buildHtmlPagesFromPlainText,
  gutenbergDefaultTxtUrl,
};
