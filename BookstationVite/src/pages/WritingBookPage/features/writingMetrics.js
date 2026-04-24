/** Default TipTap empty document HTML used when seeding the editor. */
export const EMPTY_DOC_HTML = "<p></p>";

/** Rough words-per-page for author-facing “page” estimate in the toolbar. */
export const WORDS_PER_PAGE = 250;

/** Strip tags via a temporary DOM node, split on whitespace → word count. */
export function calculateWordCount(rawHtmlString) {
  if (typeof document === "undefined") return 0;

  const temporaryContainer = document.createElement("div");
  temporaryContainer.innerHTML = rawHtmlString;

  const plainTextOnly = temporaryContainer.textContent || "";

  const wordsArray = plainTextOnly.trim().split(/\s+/).filter(Boolean);
  return wordsArray.length;
}

/** Rough pages from word count, minimum 1. */
export function estimatePageCount(totalWords) {
  return Math.max(1, Math.ceil(totalWords / WORDS_PER_PAGE));
}
