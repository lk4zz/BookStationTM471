/**
 * Browser-only: splits chapter HTML into body fragments that each fit one sheet
 * (chapter title on the first sheet is accounted for separately in layout).
 */

function createOffscreenMeasurer(widthPx) {
  const el = document.createElement("div");
  el.setAttribute("data-reading-measurer", "true");
  el.style.cssText = [
    "position:absolute",
    "left:-100000px",
    "top:0",
    `width:${widthPx}px`,
    "visibility:hidden",
    "pointer-events:none",
  ].join(";");
  document.body.appendChild(el);
  return el;
}

function removeMeasurer(el) {
  if (el?.parentNode) el.parentNode.removeChild(el);
}

function escapeHtml(text) {
  const d = document.createElement("div");
  d.textContent = text ?? "";
  return d.innerHTML;
}

function parseToBlocks(htmlString) {
  const doc = new DOMParser().parseFromString(
    `<div data-root="1">${htmlString ?? ""}</div>`,
    "text/html"
  );
  const root = doc.querySelector("[data-root]");
  if (!root) return ["<p></p>"];

  const out = [];
  root.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      out.push(node.outerHTML);
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      out.push(`<p>${escapeHtml(node.textContent)}</p>`);
    }
  });
  return out.length ? out : ["<p></p>"];
}

function buildMeasureHtml({ pageContentClass, chapterTitleClass, htmlBodyClass, chapterTitle, includeTitle, bodyHtml }) {
  const titlePart = includeTitle
    ? `<h1 class="${chapterTitleClass}">${escapeHtml(chapterTitle)}</h1>`
    : "";
  return `<div class="${pageContentClass}">${titlePart}<div class="${htmlBodyClass}">${bodyHtml}</div></div>`;
}

function measureScrollHeight(measurer, html) {
  measurer.innerHTML = html;
  const inner = measurer.firstElementChild;
  return inner ? inner.scrollHeight : 0;
}

const SPLITTABLE = new Set(["p", "h1", "h2", "h3", "h4", "blockquote"]);

function splitOversizedBlock(blockHtml, chapterTitle, isFirstPage, measurer, contentHeightPx, classes) {
  const wrap = document.createElement("div");
  wrap.innerHTML = blockHtml;
  const el = wrap.firstElementChild;
  const tag = el?.tagName?.toLowerCase() ?? "p";
  const text = el?.textContent ?? "";

  if (!SPLITTABLE.has(tag) || !text) {
    return { first: blockHtml, rest: null };
  }

  const measureBody = (bodyInner) =>
    measureScrollHeight(
      measurer,
      buildMeasureHtml({
        ...classes,
        chapterTitle,
        includeTitle: isFirstPage,
        bodyHtml: bodyInner,
      })
    );

  let lo = 0;
  let hi = text.length;
  let best = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const chunk = text.slice(0, mid);
    const trial = `<${tag}>${escapeHtml(chunk)}</${tag}>`;
    if (measureBody(trial) <= contentHeightPx) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  if (best === 0 && text.length > 0) {
    best = 1;
  }

  let first = text.slice(0, best).trimEnd();
  let rest = text.slice(best).trimStart();
  const wordBreak = first.lastIndexOf(" ");
  if (wordBreak > 0 && best - wordBreak < 48 && rest.length > 0) {
    first = text.slice(0, wordBreak).trimEnd();
    rest = text.slice(wordBreak).trimStart();
  }

  if (!first && rest) {
    first = rest.slice(0, 1);
    rest = rest.slice(1);
  }

  const firstHtml = `<${tag}>${escapeHtml(first)}</${tag}>`;
  const restHtml = rest ? `<${tag}>${escapeHtml(rest)}</${tag}>` : null;
  return { first: firstHtml, rest: restHtml };
}

/**
 * @returns {string[]} One HTML string per page (body only; title rendered in React on page 1)
 */
export function paginateChapterHtml(htmlString, chapterTitle, options) {
  const {
    contentWidthPx,
    contentHeightPx,
    pageContentClass,
    chapterTitleClass,
    htmlBodyClass,
  } = options;

  const classes = { pageContentClass, chapterTitleClass, htmlBodyClass };
  const blocks = parseToBlocks(htmlString);
  const measurer = createOffscreenMeasurer(contentWidthPx);

  try {
    const pages = [];
    let buffer = [];
    let isFirstPage = true;
    let i = 0;

    const measureBuffer = (extra = "") => {
      const bodyHtml = buffer.join("") + extra;
      const html = buildMeasureHtml({
        ...classes,
        chapterTitle,
        includeTitle: isFirstPage,
        bodyHtml,
      });
      return measureScrollHeight(measurer, html);
    };

    while (i < blocks.length || buffer.length > 0) {
      if (i >= blocks.length) {
        pages.push(buffer.join(""));
        buffer = [];
        break;
      }

      const block = blocks[i];
      const trial = buffer.length === 0 ? block : buffer.join("") + block;

      if (measureBuffer(trial) <= contentHeightPx) {
        buffer.push(block);
        i++;
        continue;
      }

      if (buffer.length > 0) {
        pages.push(buffer.join(""));
        buffer = [];
        isFirstPage = false;
        continue;
      }

      const { first, rest } = splitOversizedBlock(
        block,
        chapterTitle,
        isFirstPage,
        measurer,
        contentHeightPx,
        classes
      );

      pages.push(first);
      isFirstPage = false;

      if (rest) {
        blocks[i] = rest;
      } else {
        i++;
      }
    }

    return pages.length ? pages : [""];
  } finally {
    removeMeasurer(measurer);
  }
}
