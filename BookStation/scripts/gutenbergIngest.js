/**
 * Ingest Project Gutenberg plain-text ebooks into BookStation:
 * fetch → strip boilerplate → pages (HTML) → chapters → page chunks + embeddings → master book embedding.
 *
 * Single book:
 *   node scripts/gutenbergIngest.js --id=1342
 *   node scripts/gutenbergIngest.js --id=1342 --title="Pride and Prejudice" --userId=1
 *
 * Mass import (≥220 default catalog, auto-picks first DB user unless GUTENBERG_IMPORT_USER_ID or --userId):
 *   node scripts/gutenbergIngest.js --bulk
 *   node scripts/gutenbergIngest.js --bulk --limit=10
 *   node scripts/gutenbergIngest.js --bulk --offset=50 --limit=20
 *   node scripts/gutenbergIngest.js --bulk --catalog=./my-books.json
 *   node scripts/gutenbergIngest.js --bulk --range=3000-3050
 *
 * Respect Gutenberg's access policy: use --delay-ms (default 2500) between books; run off-peak.
 */

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const ChunkingService = require("../services/VectorEmbedServces/ChunkingService");
const EmbeddingService = require("../services/VectorEmbedServces/EmbeddingService");
const { updateBookMasterEmbedding } = require("../utils/BookDataEmbedder");
const {
  stripGutenbergBoilerplate,
  buildHtmlPagesFromPlainText,
  wordCount,
  gutenbergDefaultTxtUrl,
} = require("../utils/gutenbergPlainText");
const { getDefaultBulkCatalog } = require("./gutenbergBulkCatalog");

const USER_AGENT =
  "BookStationGutenbergIngest/1.0 (+https://www.gutenberg.org/policy/robot_access.html)";

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
    else if (a.startsWith("--delay-ms=")) args.delayMs = Math.max(0, parseInt(a.split("=")[1], 10) || 0);
    else if (a.startsWith("--range=")) args.range = a.split("=").slice(1).join("=").trim();
    else if (a === "--force") args.force = true;
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--bulk") args.bulk = true;
  }
  return args;
}

async function fetchGutenbergText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(120000),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }
  return res.text();
}

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

async function runDryRun(args) {
  const url = args.url || gutenbergDefaultTxtUrl(args.id);
  console.error(`Fetching (dry-run): ${url}`);
  const raw = await fetchGutenbergText(url);
  const clean = stripGutenbergBoilerplate(raw);
  const pages = buildHtmlPagesFromPlainText(clean, args.wordsPerPage);
  const totalWords = wordCount(clean);
  console.log(
    JSON.stringify(
      {
        gutenbergId: args.id,
        url,
        rawBytes: Buffer.byteLength(raw, "utf8"),
        cleanedWords: totalWords,
        pageCount: pages.length,
        wordsPerPageSetting: args.wordsPerPage,
      },
      null,
      2
    )
  );
}

/**
 * @param {import("@prisma/client").PrismaClient} prisma
 * @param {number | null} explicitUserId
 */
async function resolveImportUserId(prisma, explicitUserId) {
  if (explicitUserId != null && Number.isFinite(explicitUserId)) {
    return explicitUserId;
  }
  const envId = parseInt(process.env.GUTENBERG_IMPORT_USER_ID || "", 10);
  if (Number.isFinite(envId)) {
    return envId;
  }
  const u = await prisma.user.findFirst({ orderBy: { id: "asc" } });
  if (!u) {
    throw new Error(
      "No users in database. Create a user first, or set GUTENBERG_IMPORT_USER_ID or pass --userId="
    );
  }
  console.error(`Using user id=${u.id} (first user). Set --userId= or GUTENBERG_IMPORT_USER_ID to override.`);
  return u.id;
}

/**
 * @param {string | null} catalogPath
 * @param {string | null} rangeStr e.g. "3000-3100"
 */
function loadCatalogEntries(args) {
  if (args.range) {
    const m = args.range.match(/^(\d+)\s*-\s*(\d+)$/);
    if (!m) {
      throw new Error(`Invalid --range=${args.range} (expected e.g. 3000-3100)`);
    }
    const a = parseInt(m[1], 10);
    const b = parseInt(m[2], 10);
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    const out = [];
    for (let id = lo; id <= hi; id++) {
      out.push({ id, title: `Gutenberg #${id}` });
    }
    return out;
  }
  if (args.catalog) {
    const abs = path.isAbsolute(args.catalog) ? args.catalog : path.join(process.cwd(), args.catalog);
    const raw = fs.readFileSync(abs, "utf8");
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) {
      throw new Error("Catalog JSON must be an array of { id, title? }");
    }
    return data.map((row) => ({
      id: row.id,
      title: row.title || `Gutenberg #${row.id}`,
    }));
  }
  return getDefaultBulkCatalog();
}

/**
 * @param {import("@prisma/client").PrismaClient} prisma
 * @param {object} args
 * @param {boolean} [args.skipIfExists]
 */
async function ingest(prisma, args) {
  const {
    id: gutenbergId,
    userId,
    title,
    genreId,
    force,
    wordsPerPage,
    skipIfExists,
    url: urlOverride,
  } = args;

  const url = urlOverride || gutenbergDefaultTxtUrl(gutenbergId);
  const bookName = title || `Gutenberg #${gutenbergId}`;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error(`No user with id=${userId}`);
  }

  if (genreId != null && Number.isFinite(genreId)) {
    const g = await prisma.genre.findUnique({ where: { id: genreId } });
    if (!g) {
      throw new Error(`No genre with id=${genreId}`);
    }
  }

  const existing = await prisma.books.findUnique({
    where: { userId_name: { userId, name: bookName } },
  });
  if (existing) {
    if (!force) {
      if (skipIfExists) {
        return { skipped: true, reason: "exists", existingId: existing.id, bookName };
      }
      throw new Error(
        `Book "${bookName}" already exists for userId=${userId}. Use --force to delete and re-import.`
      );
    }
    await prisma.books.delete({ where: { id: existing.id } });
    console.error(`Removed existing book id=${existing.id} (--force).`);
  }

  console.error(`Fetching: ${url}`);
  const raw = await fetchGutenbergText(url);
  const clean = stripGutenbergBoilerplate(raw);
  if (!clean || clean.length < 200) {
    throw new Error(
      "Text too short after stripping boilerplate — check --id or use --url with a valid .txt."
    );
  }

  const htmlPages = buildHtmlPagesFromPlainText(clean, wordsPerPage);
  const snippet = clean.slice(0, 500).replace(/\s+/g, " ").trim();
  const description =
    `Public domain text from Project Gutenberg (ebook ${gutenbergId}). ` +
    `Source: ${url}. ` +
    snippet;

  const totalWords = wordCount(clean);

  const book = await prisma.books.create({
    data: {
      userId,
      name: bookName,
      description: description.slice(0, 65000),
      status: "COMPLETED",
    },
  });

  if (genreId != null && Number.isFinite(genreId)) {
    await prisma.bookGenre.create({
      data: { bookId: book.id, genreId },
    });
  }

  const chapter = await prisma.chapters.create({
    data: {
      bookId: book.id,
      chapterNum: 1,
      title: "Full text",
      isPublished: true,
      isLocked: false,
      wordCount: totalWords,
    },
  });

  const pageRows = [];
  for (let i = 0; i < htmlPages.length; i++) {
    const page = await prisma.pages.create({
      data: {
        chapterId: chapter.id,
        pageNum: i + 1,
        text: htmlPages[i],
      },
    });
    pageRows.push(page);
  }

  let totalChunks = 0;
  for (const page of pageRows) {
    const chunks = ChunkingService.chunkTipTapContent(page.text);
    if (chunks.length === 0) continue;

    const embeddings = await embedChunksInBatches(chunks);
    const chunkData = chunks.map((chunk, index) => ({
      content: chunk,
      embedding: embeddings[index],
      pageNumber: page.pageNum,
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

  await updateBookMasterEmbedding(book.id);

  return {
    ok: true,
    skipped: false,
    bookId: book.id,
    chapterId: chapter.id,
    gutenbergId,
    url,
    pageCount: pageRows.length,
    chunkCount: totalChunks,
    wordCount: totalWords,
    bookName,
  };
}

/**
 * @param {import("@prisma/client").PrismaClient} prisma
 * @param {ReturnType<typeof parseArgs>} args
 */
async function runBulk(prisma, args) {
  let entries = loadCatalogEntries(args);
  const { offset = 0, limit, delayMs } = args;

  entries = entries.slice(offset);
  if (limit != null && Number.isFinite(limit) && limit > 0) {
    entries = entries.slice(0, limit);
  }

  const userId = await resolveImportUserId(prisma, args.userId);

  console.error(
    JSON.stringify(
      {
        mode: "bulk",
        totalInBatch: entries.length,
        offset,
        limit: limit ?? null,
        delayMs,
        userId,
      },
      null,
      2
    )
  );

  const stats = { ok: 0, skipped: 0, failed: 0, errors: [] };

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const label = `[${i + 1}/${entries.length}]`;
    try {
      const result = await ingest(prisma, {
        id: entry.id,
        userId,
        title: entry.title,
        genreId: args.genreId,
        force: args.force,
        wordsPerPage: args.wordsPerPage,
        skipIfExists: true,
        url: null,
      });

      if (result.skipped) {
        stats.skipped++;
        console.error(`${label} skip id=${entry.id} (${result.bookName}) already exists`);
      } else {
        stats.ok++;
        console.error(
          `${label} ok id=${entry.id} bookId=${result.bookId} chunks=${result.chunkCount} words=${result.wordCount}`
        );
      }
    } catch (e) {
      stats.failed++;
      const msg = e.message || String(e);
      stats.errors.push({ id: entry.id, error: msg });
      console.error(`${label} FAIL id=${entry.id}: ${msg}`);
    }

    if (i < entries.length - 1 && delayMs > 0) {
      await sleep(delayMs);
    }
  }

  console.log(JSON.stringify({ stats }, null, 2));
}

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
        "  Single: node scripts/gutenbergIngest.js --id=<gutenbergNumericId> [--userId=] [--title=...] [--genreId=...] [--url=...] [--force] [--words-per-page=2500]\n" +
        "  Bulk:   node scripts/gutenbergIngest.js --bulk [--limit=] [--offset=] [--delay-ms=2500] [--catalog=path.json] [--range=3000-3100] [--userId=]"
    );
    process.exitCode = 1;
    return;
  }

  prismaToDisconnect = require("../db");
  const userId = await resolveImportUserId(prismaToDisconnect, args.userId);
  const result = await ingest(prismaToDisconnect, args);
  console.log(JSON.stringify(result, null, 2));
}

main()
  .catch((e) => {
    console.error(e.message || e);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (prismaToDisconnect) {
      await prismaToDisconnect.$disconnect();
    }
  });
