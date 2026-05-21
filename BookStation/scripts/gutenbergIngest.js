/**
 * Ingest Project Gutenberg plain-text ebooks into BookStation.
 * Optimized for building high-quality semantic datasets for AI retrieval/testing.
 * Strips out historical metadata/front matter to ensure clean embeddings.
 * Parses real chapter structure and extracts clean titles from text.
 *
 * Single:
 *   node scripts/gutenbergIngest.js --id=1342
 *   node scripts/gutenbergIngest.js --id=1342 --userId=1 --force
 *
 * Bulk:
 *   node scripts/gutenbergIngest.js --bulk
 *   node scripts/gutenbergIngest.js --bulk --limit=20 --offset=0
 *   node scripts/gutenbergIngest.js --bulk --catalog=./my-books.json
 *   node scripts/gutenbergIngest.js --bulk --range=3000-3050
 *
 * Dry run (no DB writes, prints stats):
 *   node scripts/gutenbergIngest.js --id=1342 --dry-run
 */

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const ChunkingService = require("../services/AIServices/VectorServices/PageChunkingService");
const EmbeddingService = require("../services/AIServices/VectorServices/EmbeddingService");
const { updateBookMasterEmbedding } = require("../utils/AIUtils/vectorUtils/BookDataEmbedder");
const {
  stripGutenbergBoilerplate,
  buildHtmlPagesFromPlainText,
  wordCount,
  gutenbergDefaultTxtUrl,
} = require("../utils/gutenbergPlainText");

const USER_AGENT =
  "BookStationGutenbergIngest/2.0 (+https://www.gutenberg.org/policy/robot_access.html)";

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = {
    id: null,
    userId: null,
    title: null,
    genreId: null,
    url: null,
    force: false,
    dryRun: false,
    wordsPerPage: 2500,
    bulk: false,
    catalog: null,
    limit: null,
    offset: 0,
    delayMs: 2500,
    range: null,
  };
  for (const a of process.argv.slice(2)) {
    if (a.startsWith("--id=")) args.id = parseInt(a.split("=")[1], 10);
    else if (a.startsWith("--userId=")) args.userId = parseInt(a.split("=")[1], 10);
    else if (a.startsWith("--title=")) args.title = a.split("=").slice(1).join("=").trim();
    else if (a.startsWith("--genreId=")) args.genreId = parseInt(a.split("=")[1], 10);
    else if (a.startsWith("--url=")) args.url = a.split("=").slice(1).join("=").trim();
    else if (a.startsWith("--words-per-page="))
      args.wordsPerPage = Math.max(500, parseInt(a.split("=")[1], 10) || 2500);
    else if (a.startsWith("--catalog=")) args.catalog = a.split("=").slice(1).join("=").trim();
    else if (a.startsWith("--limit=")) args.limit = parseInt(a.split("=")[1], 10);
    else if (a.startsWith("--offset=")) args.offset = parseInt(a.split("=")[1], 10) || 0;
    else if (a.startsWith("--delay-ms="))
      args.delayMs = Math.max(0, parseInt(a.split("=")[1], 10) || 0);
    else if (a.startsWith("--range=")) args.range = a.split("=").slice(1).join("=").trim();
    else if (a === "--force") args.force = true;
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--bulk") args.bulk = true;
  }
  return args;
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

async function fetchText(url, timeoutMs = 120000) {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  return res.text();
}

/**
 * Fetch basic book metadata from Gutendex (https://gutendex.com).
 * Optimized for AI semantic clusters — keeping only absolute essentials for UI.
 * @returns {Promise<{ author: string|null, title: string|null, coverImage: string|null }|null>}
 */
async function fetchGutenbergMeta(gutenbergId) {
  try {
    const res = await fetch(`https://gutendex.com/books/?ids=${gutenbergId}`, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const book = json?.results?.[0];
    if (!book) return null;

    // Author: "Austen, Jane" → "Jane Austen"
    const rawAuthor = book.authors?.[0]?.name || null;
    const author = rawAuthor ? normalizeAuthorName(rawAuthor) : null;
    const title = book.title || null;
    const coverImage = book.formats?.["image/jpeg"] || null;

    return { title, author, coverImage };
  } catch {
    return null;
  }
}

function normalizeAuthorName(raw) {
  if (!raw) return null;
  const parts = raw.split(",").map((s) => s.trim());
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  return parts[0];
}

// ---------------------------------------------------------------------------
// Chapter parsing (AI-Optimized)
// ---------------------------------------------------------------------------

/**
 * Split plain text into real narrative chapters.
 * - Skips non-story front matter (prefaces, intro, etc.) to keep embeddings pure.
 * - Cleans titles so "CHAPTER IV. THE OLD HOUSE" becomes "The Old House".
 */
function parseRealChapters(cleanText, maxChapters = 80) {
  const PATTERNS = [
    /^(CHAPTER\s+(?:[IVXLCDM]+|\d+)(?:[\s.:—\-]+.{0,80})?)$/,
    /^(Chapter\s+(?:[IVXLCDM]+|\d+)(?:[\s.:—\-]+.{0,80})?)$/,
    /^(BOOK\s+(?:[IVXLCDM]+|\d+)(?:[\s.:—\-]+.{0,80})?)$/,
    /^(Book\s+(?:[IVXLCDM]+|\d+)(?:[\s.:—\-]+.{0,80})?)$/,
    /^(PART\s+(?:[IVXLCDM]+|\d+)(?:[\s.:—\-]+.{0,80})?)$/,
    /^(Part\s+(?:[IVXLCDM]+|\d+)(?:[\s.:—\-]+.{0,80})?)$/,
  ];

  const bannedTitles = [
    "preface",
    "introduction",
    "contents",
    "editor",
    "notes",
    "foreword",
    "prologue",
    "index",
  ];

  for (const pat of PATTERNS) {
    const global = new RegExp(pat.source, "gm");
    const matches = [...cleanText.matchAll(global)];
    
    if (matches.length >= 2 && matches.length <= maxChapters) {
      const chapters = [];
      let validChapterCount = 0;

      for (let i = 0; i < matches.length; i++) {
        const start = matches[i].index;
        const end = i + 1 < matches.length ? matches[i + 1].index : cleanText.length;
        const chapterText = cleanText.slice(start, end).trim();
        
        if (chapterText.length < 100) continue; // skip empty/near-empty

        const rawTitle = matches[i][1].trim();
        const lowerTitle = rawTitle.toLowerCase();

        // 1. FILTER FRONT MATTER
        if (bannedTitles.some((b) => lowerTitle.includes(b))) {
          continue;
        }

        // 2. CLEAN TITLE STRING
        let cleanedTitle = rawTitle
          .replace(/^(chapter|book|part)\s+[ivxlcdm\d]+[\s.:—-]*/i, "")
          .trim();
        
        validChapterCount++;
        cleanedTitle = cleanedTitle || `Chapter ${validChapterCount}`;

        chapters.push({ title: cleanedTitle, text: chapterText });
      }
      
      if (chapters.length >= 2) return chapters;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Embedding helpers
// ---------------------------------------------------------------------------

const EMBED_BATCH = 32;
const PAGE_CHUNK_INSERT_BATCH = 200;

async function embedChunksInBatches(chunks) {
  const out = [];
  for (let i = 0; i < chunks.length; i += EMBED_BATCH) {
    const slice = chunks.slice(i, i + EMBED_BATCH);
    const emb = await Promise.all(slice.map((c) => EmbeddingService.generateEmbedding(c)));
    out.push(...emb);
  }
  return out;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ---------------------------------------------------------------------------
// Dry run
// ---------------------------------------------------------------------------

async function runDryRun(args) {
  const url = args.url || gutenbergDefaultTxtUrl(args.id);
  console.error(`Fetching (dry-run): ${url}`);
  const raw = await fetchText(url);
  const clean = stripGutenbergBoilerplate(raw);
  const pages = buildHtmlPagesFromPlainText(clean, args.wordsPerPage);
  const totalWords = wordCount(clean);
  const chapters = parseRealChapters(clean);
  const meta = await fetchGutenbergMeta(args.id);

  console.log(
    JSON.stringify(
      {
        gutenbergId: args.id,
        url,
        rawBytes: Buffer.byteLength(raw, "utf8"),
        cleanedWords: totalWords,
        pageCount: pages.length,
        chaptersParsed: chapters ? chapters.length : "(none — will use single chapter)",
        wordsPerPageSetting: args.wordsPerPage,
        meta: meta || "(unavailable)",
      },
      null,
      2
    )
  );
}

// ---------------------------------------------------------------------------
// User resolution
// ---------------------------------------------------------------------------

async function resolveImportUserId(prisma, explicitUserId) {
  if (explicitUserId != null && Number.isFinite(explicitUserId)) return explicitUserId;
  const envId = parseInt(process.env.GUTENBERG_IMPORT_USER_ID || "", 10);
  if (Number.isFinite(envId)) return envId;
  const u = await prisma.user.findFirst({ orderBy: { id: "desc" } });
  if (!u) {
    throw new Error(
      "No users in DB. Create one first, or set GUTENBERG_IMPORT_USER_ID / --userId=."
    );
  }
  console.error(`Using userId=${u.id} (first user). Override with --userId= or GUTENBERG_IMPORT_USER_ID.`);
  return u.id;
}

// ---------------------------------------------------------------------------
// Catalog loading
// ---------------------------------------------------------------------------

function loadCatalogEntries(args) {
  if (args.range) {
    const m = args.range.match(/^(\d+)\s*-\s*(\d+)$/);
    if (!m) throw new Error(`Invalid --range="${args.range}". Expected e.g. 3000-3100.`);
    const lo = Math.min(parseInt(m[1], 10), parseInt(m[2], 10));
    const hi = Math.max(parseInt(m[1], 10), parseInt(m[2], 10));
    return Array.from({ length: hi - lo + 1 }, (_, i) => ({ id: lo + i }));
  }
  if (args.catalog) {
    const abs = path.isAbsolute(args.catalog) ? args.catalog : path.join(process.cwd(), args.catalog);
    const data = JSON.parse(fs.readFileSync(abs, "utf8"));
    if (!Array.isArray(data)) throw new Error("Catalog JSON must be an array of { id, title? }.");
    return data.map((r) => ({ id: r.id, title: r.title || null }));
  }
  return CURATED_CATALOG;
}

// ---------------------------------------------------------------------------
// Core ingest
// ---------------------------------------------------------------------------

async function ingest(prisma, args) {
  const {
    id: gutenbergId,
    userId,
    title: titleOverride,
    genreId,
    force,
    wordsPerPage,
    skipIfExists,
    url: urlOverride,
  } = args;

  const url = urlOverride || gutenbergDefaultTxtUrl(gutenbergId);

  // --- Validate user ---
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error(`No user with id=${userId}.`);

  if (genreId != null && Number.isFinite(genreId)) {
    const g = await prisma.genre.findUnique({ where: { id: genreId } });
    if (!g) throw new Error(`No genre with id=${genreId}.`);
  }

  // --- Fetch Gutendex UI metadata (non-fatal) ---
  const meta = await fetchGutenbergMeta(gutenbergId);
  const catalogEntry = CURATED_CATALOG.find((e) => e.id === gutenbergId);
  const bookName =
    titleOverride ||
    catalogEntry?.title ||
    meta?.title ||
    `Gutenberg #${gutenbergId}`;

  // --- Duplicate check ---
  const existing = await prisma.books.findUnique({
    where: { userId_name: { userId, name: bookName } },
  });
  if (existing) {
    if (!force) {
      if (skipIfExists) return { skipped: true, reason: "exists", existingId: existing.id, bookName };
      throw new Error(`"${bookName}" already exists for userId=${userId}. Use --force to overwrite.`);
    }
    await prisma.books.delete({ where: { id: existing.id } });
    console.error(`Deleted existing bookId=${existing.id} (--force).`);
  }

  // --- Fetch and strip text ---
  console.error(`Fetching: ${url}`);
  const raw = await fetchText(url);
  const clean = stripGutenbergBoilerplate(raw);
  if (!clean || clean.length < 300) {
    throw new Error("Text too short after boilerplate strip — check --id or use --url.");
  }

  const totalWords = wordCount(clean);

  // --- Chapter structure ---
  const parsedChapters = parseRealChapters(clean);
  const chaptersToInsert = parsedChapters
    ? parsedChapters
    : [{ title: "Full Text", text: clean }];

  // --- Description Generation (Pure Content Snippet) ---
  // To avoid polluting vector embeddings with metadata tags or boilerplate headers, 
  // we extract the text strictly from the start of the first valid narrative chapter.
  const firstChapterText = chaptersToInsert[0].text;
  
  // Stripping out the first line in case the chapter title is printed at the top of the text block
  const textWithoutTitle = firstChapterText.replace(/^.+?\n/, "").trim();
  const snippet = textWithoutTitle.slice(0, 600).replace(/\s+/g, " ").trim();
  const description = `${snippet}...`; // Pure story snippet.

  // --- Create book ---
  const book = await prisma.books.create({
    data: {
      userId,
      name: bookName,
      description, 
      status: "COMPLETED",
      coverImage: meta?.coverImage || null,
    },
  });

  // --- Genre association ---
  if (genreId != null && Number.isFinite(genreId)) {
    await prisma.bookGenre.create({ data: { bookId: book.id, genreId } });
  }

  let totalChunks = 0;
  let chapterCount = 0;

  for (let ci = 0; ci < chaptersToInsert.length; ci++) {
    const { title: chapterTitle, text: chapterText } = chaptersToInsert[ci];
    const chapterWords = wordCount(chapterText);

    const chapter = await prisma.chapters.create({
      data: {
        bookId: book.id,
        chapterNum: ci + 1,
        title: chapterTitle,
        isPublished: true,
        isLocked: false,
        wordCount: chapterWords,
      },
    });
    chapterCount++;

    const htmlPages = buildHtmlPagesFromPlainText(chapterText, wordsPerPage);

    for (let pi = 0; pi < htmlPages.length; pi++) {
      const page = await prisma.pages.create({
        data: {
          chapterId: chapter.id,
          pageNum: pi + 1,
          text: htmlPages[pi],
        },
      });

      const chunks = ChunkingService.chunkTipTapContent(page.text);
      if (!chunks.length) continue;

      const embeddings = await embedChunksInBatches(chunks);
      const chunkData = chunks.map((chunk, idx) => ({
        content: chunk,
        embedding: embeddings[idx],
        pageId: page.id,
        chapterId: chapter.id,
        bookId: book.id,
        userId,
      }));

      for (let j = 0; j < chunkData.length; j += PAGE_CHUNK_INSERT_BATCH) {
        await prisma.pageChunk.createMany({
          data: chunkData.slice(j, j + PAGE_CHUNK_INSERT_BATCH),
        });
      }
      totalChunks += chunks.length;
    }
  }

  // --- Master book embedding ---
  await updateBookMasterEmbedding(book.id);

  return {
    ok: true,
    skipped: false,
    bookId: book.id,
    gutenbergId,
    url,
    bookName,
    author: meta?.author || null,
    chapterCount,
    wordCount: totalWords,
    chunkCount: totalChunks,
  };
}

// ---------------------------------------------------------------------------
// Bulk runner
// ---------------------------------------------------------------------------

async function runBulk(prisma, args) {
  let entries = loadCatalogEntries(args);
  entries = entries.slice(args.offset || 0);
  if (args.limit != null && Number.isFinite(args.limit) && args.limit > 0) {
    entries = entries.slice(0, args.limit);
  }

  const userId = await resolveImportUserId(prisma, args.userId);

  console.error(
    JSON.stringify({ mode: "bulk", total: entries.length, userId, delayMs: args.delayMs }, null, 2)
  );

  const stats = { ok: 0, skipped: 0, failed: 0, errors: [] };

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const label = `[${i + 1}/${entries.length}]`;
    try {
      const result = await ingest(prisma, {
        id: entry.id,
        userId,
        title: entry.title || null,
        genreId: entry.genreId ?? args.genreId ?? null,
        force: args.force,
        wordsPerPage: args.wordsPerPage,
        skipIfExists: true,
        url: null,
      });
      
      if (result.skipped) {
        stats.skipped++;
        console.error(`${label} SKIP  id=${entry.id}  "${result.bookName}" already exists`);
      } else {
        stats.ok++;
        console.error(
          `${label} OK    id=${entry.id}  bookId=${result.bookId}  "${result.bookName}"` +
            `  chapters=${result.chapterCount}  chunks=${result.chunkCount}  words=${result.wordCount}`
        );
      }
    } catch (e) {
      stats.failed++;
      const msg = e.message || String(e);
      stats.errors.push({ id: entry.id, error: msg });
      console.error(`${label} FAIL  id=${entry.id}: ${msg}`);
    }

    if (i < entries.length - 1 && args.delayMs > 0) await sleep(args.delayMs);
  }

  console.log(JSON.stringify({ stats }, null, 2));
}

// ---------------------------------------------------------------------------
// Curated catalog — chosen for semantic diversity across clusters
// ---------------------------------------------------------------------------

/** @type {{ id: number, title: string, genreId?: number }[]} */
const CURATED_CATALOG = [
  // --- Gothic / Horror Cluster ---
  { id: 84, title: "Frankenstein", genreId: 5 },
  { id: 345, title: "Dracula", genreId: 5 },
  { id: 43, title: "The Strange Case of Dr Jekyll and Mr Hyde", genreId: 5 },
  { id: 1952, title: "The Yellow Wallpaper", genreId: 5 },
  { id: 174, title: "The Turn of the Screw", genreId: 5 },
  { id: 696, title: "The Castle of Otranto", genreId: 5 },

  // --- Romance / Social Cluster ---
  { id: 1342, title: "Pride and Prejudice", genreId: 4 },
  { id: 161, title: "Sense and Sensibility", genreId: 4 },
  { id: 105, title: "Persuasion", genreId: 4 },
  { id: 158, title: "Emma", genreId: 4 },
  { id: 1260, title: "Jane Eyre", genreId: 4 },
  { id: 1259, title: "North and South", genreId: 4 },
  { id: 2095, title: "The Age of Innocence", genreId: 4 },
  { id: 768, title: "Wuthering Heights", genreId: 4 },

  // --- Adventure Cluster ---
  { id: 74, title: "Treasure Island", genreId: 6 },
  { id: 76, title: "Adventures of Tom Sawyer", genreId: 6 },
  { id: 80, title: "Kidnapped", genreId: 6 },
  { id: 120, title: "Treasure of the Sierra Madre", genreId: 6 },
  { id: 2097, title: "The Sea-Wolf", genreId: 6 },
  { id: 1257, title: "The Three Musketeers", genreId: 6 },
  { id: 1184, title: "The Count of Monte Cristo", genreId: 6 },

  // --- Sci-Fi / Speculative Cluster ---
  { id: 35, title: "The Time Machine", genreId: 2 },
  { id: 36, title: "The War of the Worlds", genreId: 2 },
  { id: 37, title: "The Island of Doctor Moreau", genreId: 2 },
  { id: 38, title: "The Invisible Man", genreId: 2 },
  { id: 25525, title: "The First Men in the Moon", genreId: 2 },
  { id: 5230, title: "The Food of the Gods", genreId: 2 },

  // --- Mystery / Suspense Cluster ---
  { id: 1661, title: "The Adventures of Sherlock Holmes", genreId: 3 },
  { id: 2097, title: "The Hound of the Baskervilles", genreId: 3 },
  { id: 244, title: "A Study in Scarlet", genreId: 3 },
  { id: 108, title: "The Moonstone", genreId: 3 },
  { id: 2852, title: "The Mystery of the Yellow Room", genreId: 3 },

  // --- Literary / Psychological Cluster ---
  { id: 2701, title: "Moby-Dick", genreId: 6 },
  { id: 5200, title: "The Metamorphosis", genreId: 6 },
  { id: 98, title: "A Tale of Two Cities", genreId: 6 },
  { id: 99, title: "Great Expectations", genreId: 6 },
  { id: 1400, title: "David Copperfield", genreId: 6 },
  { id: 730, title: "Oliver Twist", genreId: 6 },
  { id: 2554, title: "Crime and Punishment", genreId: 6 },
  { id: 2600, title: "The Brothers Karamazov", genreId: 6 },
  { id: 1399, title: "Anna Karenina", genreId: 6 },
  { id: 243, title: "The Picture of Dorian Gray", genreId: 6 },

  // --- Philosophy / Abstract Cluster ---
  { id: 1325, title: "Walden", genreId: 6 },
  { id: 1320, title: "The Art of War", genreId: 6 },
  { id: 16328, title: "The Prince", genreId: 6 },
  { id: 4363, title: "Beyond Good and Evil", genreId: 6 },
  { id: 1232, title: "The Nicomachean Ethics", genreId: 6 },
  { id: 1321, title: "The Book of Tea", genreId: 6 },

  // --- Tragedy / Drama ---
  { id: 1513, title: "Romeo and Juliet", genreId: 6 },
  { id: 1514, title: "Hamlet", genreId: 6 },
  { id: 1516, title: "Macbeth", genreId: 6 },
  { id: 1519, title: "King Lear", genreId: 6 },
  { id: 1518, title: "Othello", genreId: 6 },
  { id: 1528, title: "The Tempest", genreId: 6 },
  { id: 2265, title: "Ghosts", genreId: 6 },
  { id: 5765, title: "The Importance of Being Earnest", genreId: 6 },
  { id: 844, title: "A Doll's House", genreId: 6 },

  // --- Children's / Fantasy ---
  { id: 11, title: "Alice's Adventures in Wonderland", genreId: 1 },
  { id: 12, title: "Through the Looking-Glass", genreId: 1 },
  { id: 55, title: "The Wonderful Wizard of Oz", genreId: 1 },
  { id: 16, title: "Peter Pan", genreId: 1 },
  { id: 996, title: "The Jungle Book", genreId: 1 },
  { id: 5, title: "Grimms' Fairy Tales", genreId: 1 },

  // --- American Lit ---
  { id: 2542, title: "The Scarlet Letter", genreId: 6 },
  { id: 76, title: "Adventures of Huckleberry Finn", genreId: 6 },
  { id: 1334, title: "The Souls of Black Folk", genreId: 6 },
  { id: 514, title: "The Call of the Wild", genreId: 6 },
  { id: 215, title: "The Sea Wolf", genreId: 6 },

  // --- Russian Lit ---
  { id: 2197, title: "War and Peace", genreId: 6 },
  { id: 46, title: "A Christmas Carol", genreId: 6 },
  { id: 700, title: "The Idiot", genreId: 6 },
  { id: 400, title: "The Brothers Karamazov (alt)", genreId: 6 },

  // --- Short Stories / Novellas ---
  { id: 1064, title: "The Turn of the Screw", genreId: 3 },
  { id: 30, title: "The Mysterious Island", genreId: 3 },
  { id: 10, title: "Twenty Thousand Leagues Under the Sea", genreId: 3 },
  { id: 164, title: "Twenty Thousand Leagues (French)", genreId: 3 },
  { id: 103, title: "Around the World in Eighty Days", genreId: 3 },
  { id: 83, title: "Journey to the Center of the Earth", genreId: 3 },
];

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

let prismaToDisconnect = null;

async function main() {
  const args = parseArgs();

  if (args.dryRun) {
    if (!args.id || Number.isNaN(args.id)) {
      console.error("Dry-run requires --id=<gutenbergNumericId>");
      process.exitCode = 1;
      return;
    }
    await runDryRun(args);
    return;
  }

  if (args.bulk) {
    prismaToDisconnect = require("../db");
    await runBulk(prismaToDisconnect, args);
    return;
  }

  if (!args.id || Number.isNaN(args.id)) {
    console.error(
      "Usage:\n" +
        "  Single:  node scripts/gutenbergIngest.js --id=<id> [--userId=] [--title=] [--genreId=] [--force]\n" +
        "  Bulk:    node scripts/gutenbergIngest.js --bulk [--limit=] [--offset=] [--delay-ms=2500] [--catalog=] [--range=]\n" +
        "  Dry-run: node scripts/gutenbergIngest.js --id=<id> --dry-run"
    );
    process.exitCode = 1;
    return;
  }

  prismaToDisconnect = require("../db");
  const userId = await resolveImportUserId(prismaToDisconnect, args.userId);
  const result = await ingest(prismaToDisconnect, { ...args, userId });
  console.log(JSON.stringify(result, null, 2));
}

main()
  .catch((e) => {
    console.error(e.message || e);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (prismaToDisconnect) await prismaToDisconnect.$disconnect();
  });