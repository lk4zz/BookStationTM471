/**
 * Geometric projection of recommendation cosine similarity onto a 2D "radar" plane.
 * Radius r = 1 - similarityScore (distance from center = dissimilarity).
 * Angle is deterministic from book id (visual spread only).
 */

export function simpleHash(seed) {
  const str = String(seed ?? "");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getDeterministicAngle(seed) {
  const hash = simpleHash(seed);
  return (hash % 360) * (Math.PI / 180);
}

export function projectToRadar(books) {
  return books.map((book) => {
    const r = 1 - book.similarityScore;
    const theta = getDeterministicAngle(book.id);

    return {
      ...book,
      x: r * Math.cos(theta),
      y: r * Math.sin(theta),
      r,
      theta,
    };
  });
}
