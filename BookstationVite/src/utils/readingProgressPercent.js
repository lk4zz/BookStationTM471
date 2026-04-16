function sortedChaptersList(chapters) {
  return [...(chapters ?? [])].sort(
    (a, b) => (a.chapterNum ?? 0) - (b.chapterNum ?? 0)
  );
}

/**
 * Ordinal position in the ordered chapter list (not raw `chapterNum`, which can have gaps).
 * @param {object} book — may include `chapters: [{ id, chapterNum }]`
 * @param {{ lastChapterId?: number } | null | undefined} progress
 */
export function readingProgressSummary(book, progress) {
  const chapters = sortedChaptersList(book?.chapters);
  const total = chapters.length;
  if (total === 0) {
    return {
      percent: progress?.lastChapterId ? 100 : 0,
      ordinal: 0,
      total: 0,
      started: Boolean(progress?.lastChapterId),
    };
  }
  if (!progress?.lastChapterId) {
    return { percent: 0, ordinal: 0, total, started: false };
  }
  const idx = chapters.findIndex((c) => Number(c.id) === Number(progress.lastChapterId));
  if (idx < 0) {
    return { percent: 0, ordinal: 0, total, started: false };
  }
  const ordinal = idx + 1;
  const percent = Math.min(100, Math.round((ordinal / total) * 100));
  return {
    percent,
    ordinal,
    total,
    started: true,
    chapterNum: chapters[idx]?.chapterNum,
  };
}

/**
 * @param {object} book — may include `chapters: [{ id, chapterNum }]`
 * @param {{ lastChapterId?: number } | null} progress
 * @returns {number} 0–100
 */
export function readingProgressPercent(book, progress) {
  return readingProgressSummary(book, progress).percent;
}
