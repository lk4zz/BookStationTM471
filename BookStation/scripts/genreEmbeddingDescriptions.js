/**
 * Curated long-form texts for taste-map anchor embeddings (see exportTasteMapJson.js).
 * Keys are normalized genre names; DB Genre.type may use different casing (e.g. "Sci-Fi", "Fantasy").
 */

const THRILLER =
  "Thriller fiction focuses on high tension, suspense, and constant psychological or physical danger. Stories emphasize urgency, risk, and escalating stakes where characters face threats, conspiracies, or survival scenarios. Fast pacing, unpredictability, paranoia, moral ambiguity, and cliffhanger-driven structure are central, often involving crime, espionage, or psychological manipulation.";

const SCI_FI =
  "Science fiction explores speculative futures, advanced technology, artificial intelligence, space exploration, and altered human conditions shaped by scientific or technological change. It often examines the consequences of innovation, humanity's relationship with machines, alternate realities, and societal evolution under scientific progress or collapse. Can range from hard science realism to philosophical or dystopian interpretations.";

const ROMANCE =
  "Romance centers on emotional relationships, romantic attraction, intimacy development, and interpersonal bonding between characters. Core focus is emotional vulnerability, connection, tension in relationships, and the progression from attraction to emotional commitment or loss. Conflict is usually internal or relational rather than external danger, with emphasis on emotional resolution and character bonding.";

const FANTASY =
  "Fantasy features magical systems, mythical creatures, supernatural forces, and fictional worlds that operate outside real-world physics. It often includes quests, world-building, moral archetypes, and symbolic struggles between good and evil or order and chaos. Settings may include kingdoms, enchanted realms, or alternate universes governed by magic or divine systems.";

const MYSTERY =
  "Mystery fiction revolves around unknown events, hidden truths, and structured discovery processes. It emphasizes investigation, clue analysis, deduction, and gradual revelation of information. The narrative is driven by solving puzzles such as crimes, disappearances, or unexplained phenomena, often engaging the reader in logical reasoning and red herrings.";

const HISTORICAL =
  "Historical fiction is grounded in real-world past settings, cultures, and events, often blending fictional characters or narratives with accurate historical context. It emphasizes period authenticity, societal structure, cultural norms, political dynamics, and real historical constraints. Themes often include war, social change, personal survival, and human behavior shaped by historical circumstances.";

/** Primary lookup after normalization */
const EMBEDDING_TEXT_BY_KEY = {
  thriller: THRILLER,
  "sci-fi": SCI_FI,
  scifi: SCI_FI,
  romance: ROMANCE,
  fantasy: FANTASY,
  mystery: MYSTERY,
  historical: HISTORICAL,
};

function normalizeGenreKey(type) {
  let s = String(type || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
  if (s === "sci fi" || s === "science fiction") s = "sci-fi";
  return s;
}

/**
 * Text passed to EmbeddingService for this genre anchor.
 * Falls back to the raw genre name if no curated blurb exists.
 * @param {string} genreType - Genre.type from DB or fallback label
 * @returns {string}
 */
function getGenreEmbeddingText(genreType) {
  const key = normalizeGenreKey(genreType);
  if (EMBEDDING_TEXT_BY_KEY[key]) {
    return EMBEDDING_TEXT_BY_KEY[key];
  }
  return String(genreType || "fiction").trim() || "fiction";
}

module.exports = {
  getGenreEmbeddingText,
};
