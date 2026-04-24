/**
 * Client-side name search: substring match plus Levenshtein distance ≤ 2 for typos.
 */

function norm(s) {
  return String(s ?? "")
    .toLowerCase()
    .trim();
}

export function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;

  const row = new Array(n + 1);
  for (let j = 0; j <= n; j += 1) row[j] = j;

  for (let i = 1; i <= m; i += 1) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= n; j += 1) {
      const tmp = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = tmp;
    }
  }
  return row[n];
}

/**
 * @param {string} haystack
 * @param {string} query
 */
export function fuzzyMatchesText(haystack, query) {
  const h = norm(haystack);
  const q = norm(query);
  if (!q) return true;
  if (!h) return false;
  if (h.includes(q)) return true;
  if (q.length === 1) return h.includes(q);

  if (levenshtein(h, q) <= 2) return true;

  const parts = h.split(/[\s._-]+/).filter(Boolean);
  for (const part of parts) {
    if (part.includes(q)) return true;
    if (part.length >= 2 && q.length >= 2 && levenshtein(part, q) <= 2) return true;
  }
  return false;
}

/**
 * Users: match name or email.
 */
export function userMatchesSearch(user, query) {
  if (!query.trim()) return true;
  return (
    fuzzyMatchesText(user?.name, query) || fuzzyMatchesText(user?.email, query)
  );
}

/**
 * Books: match title or author name.
 */
export function bookMatchesSearch(book, query) {
  if (!query.trim()) return true;
  return (
    fuzzyMatchesText(book?.name, query) ||
    fuzzyMatchesText(book?.author?.name, query)
  );
}
