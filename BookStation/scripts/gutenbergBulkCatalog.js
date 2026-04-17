/**
 * Default bulk-import list: ≥220 unique Project Gutenberg ebook IDs.
 * Core entries use real titles where common; padding uses "Gutenberg #id" (still unique per user).
 *
 * Override with --catalog=./my.json  →  [{ "id": 123, "title": "..." }, ...]
 */

/** @type {{ id: number, title: string }[]} */
const KNOWN_TITLES = [
  { id: 1, title: "The Declaration of Independence of the United States of America" },
  { id: 2, title: "The United States Constitution" },
  { id: 4, title: "Lincoln's Gettysburg Address" },
  { id: 5, title: "The United States Bill of Rights" },
  { id: 10, title: "The King James Bible" },
  { id: 11, title: "Alice's Adventures in Wonderland" },
  { id: 12, title: "Through the Looking-Glass" },
  { id: 13, title: "The Hunting of the Snark" },
  { id: 16, title: "Peter Pan" },
  { id: 21, title: "A Connecticut Yankee in King Arthur's Court" },
  { id: 35, title: "The Time Machine" },
  { id: 36, title: "The War of the Worlds" },
  { id: 37, title: "The Island of Doctor Moreau" },
  { id: 38, title: "The Invisible Man" },
  { id: 43, title: "The Strange Case of Dr Jekyll and Mr Hyde" },
  { id: 46, title: "A Christmas Carol" },
  { id: 55, title: "The Wonderful Wizard of Oz" },
  { id: 56, title: "The Marvelous Land of Oz" },
  { id: 57, title: "Ozma of Oz" },
  { id: 58, title: "Dorothy and the Wizard in Oz" },
  { id: 59, title: "The Road to Oz" },
  { id: 60, title: "The Emerald City of Oz" },
  { id: 74, title: "Treasure Island" },
  { id: 76, title: "The Adventures of Tom Sawyer" },
  { id: 80, title: "Kidnapped" },
  { id: 84, title: "Frankenstein; or, The Modern Prometheus" },
  { id: 92, title: "Ivanhoe" },
  { id: 98, title: "A Tale of Two Cities" },
  { id: 99, title: "Great Expectations" },
  { id: 100, title: "Hard Times" },
  { id: 174, title: "Peter Pan in Kensington Gardens" },
  { id: 302, title: "The Odyssey" },
  { id: 345, title: "Dracula" },
  { id: 996, title: "The Jungle Book" },
  { id: 1001, title: "The Arabian Nights Entertainments" },
  { id: 1080, title: "Aesop's Fables" },
  { id: 1228, title: "Poems by Emily Dickinson" },
  { id: 1232, title: "The Picture of Dorian Gray" },
  { id: 1259, title: "North and South" },
  { id: 1260, title: "Jane Eyre" },
  { id: 1320, title: "The Art of War" },
  { id: 1321, title: "The Book of Tea" },
  { id: 1325, title: "Walden" },
  { id: 1334, title: "The Souls of Black Folk" },
  { id: 1342, title: "Pride and Prejudice" },
  { id: 1400, title: "Great Expectations" },
  { id: 1513, title: "Romeo and Juliet" },
  { id: 1514, title: "Hamlet" },
  { id: 1515, title: "The Merchant of Venice" },
  { id: 1516, title: "Macbeth" },
  { id: 1517, title: "A Midsummer Night's Dream" },
  { id: 1518, title: "Othello" },
  { id: 1519, title: "King Lear" },
  { id: 1520, title: "Julius Caesar" },
  { id: 1528, title: "The Tempest" },
  { id: 1545, title: "Much Ado About Nothing" },
  { id: 1546, title: "As You Like It" },
  { id: 1547, title: "Twelfth Night" },
  { id: 1551, title: "Shakespeare's Sonnets" },
  { id: 1661, title: "The Adventures of Sherlock Holmes" },
  { id: 1952, title: "The Yellow Wallpaper" },
  { id: 2542, title: "The Scarlet Letter" },
  { id: 2591, title: "Grimms' Fairy Tales" },
  { id: 2600, title: "The War of the Worlds" },
  { id: 2701, title: "Moby-Dick" },
  { id: 5200, title: "The Metamorphosis" },
  { id: 16328, title: "The Prince" },
];

const TARGET_COUNT = 220;

function dedupeById(entries) {
  const seen = new Map();
  for (const e of entries) {
    if (!e || typeof e.id !== "number" || Number.isNaN(e.id)) continue;
    const title = (e.title && String(e.title).trim()) || `Gutenberg #${e.id}`;
    seen.set(e.id, { id: e.id, title });
  }
  return [...seen.values()].sort((a, b) => a.id - b.id);
}

/**
 * Pad with ascending numeric IDs (avoids overlapping KNOWN_TITLES) until TARGET_COUNT.
 * @returns {{ id: number, title: string }[]}
 */
function getDefaultBulkCatalog() {
  const base = dedupeById(KNOWN_TITLES);
  const idsUsed = new Set(base.map((b) => b.id));
  const out = [...base];
  let n = 2000;
  while (out.length < TARGET_COUNT && n < 50000) {
    if (!idsUsed.has(n)) {
      idsUsed.add(n);
      out.push({ id: n, title: `Gutenberg #${n}` });
    }
    n++;
  }
  return out.sort((a, b) => a.id - b.id);
}

module.exports = {
  getDefaultBulkCatalog,
  TARGET_COUNT,
  KNOWN_TITLES,
};
