/**
 * Taste map export: books + user taste + snapshots.
 * EXCLUDES books already in the user's library to accurately reflect "For You" recommendations.
 */
const fs = require("fs");
const path = require("path");
const prisma = require("../db");

function parseArgs() {
  const args = { userId: null, out: null };
  for (const a of process.argv.slice(2)) {
    if (a.startsWith("--userId=")) args.userId = parseInt(a.split("=")[1], 10);
    if (a.startsWith("--out=")) args.out = a.split("=")[1];
  }
  return args;
}

function parseEmbedding(raw) {
  if (raw == null) return null;
  return typeof raw === "string" ? JSON.parse(raw) : raw;
}

async function main() {
  const { userId, out } = parseArgs();

  let excludeBookIds = [];
  const payload = {
    meta: {},
    books: [],
    user: null,
    userSnapshots: [],
  };

  if (userId && !Number.isNaN(userId)) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, tasteProfile: true },
    });

    if (user) {
      payload.user = {
        id: user.id,
        tasteProfile: user.tasteProfile ? JSON.parse(user.tasteProfile) : null,
      };
    }

    const snaps = await prisma.userTasteSnapshot.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true, tasteProfile: true },
    });

    payload.userSnapshots = snaps.map((s) => ({
      createdAt: s.createdAt.toISOString(),
      tasteProfile: JSON.parse(s.tasteProfile),
    }));

    const library = await prisma.library.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (library) {
      const rows = await prisma.libraryBook.findMany({
        where: { libraryId: library.id },
        select: { bookId: true },
      });
      excludeBookIds = rows.map((r) => r.bookId);
    }
  }

  const books = await prisma.books.findMany({
    where: {
      embedding: { not: null },
      NOT: { status: "DRAFT" },
      ...(excludeBookIds.length > 0 && { id: { notIn: excludeBookIds } }),
    },
    select: {
      id: true,
      name: true,
      status: true,
      embedding: true,
    },
    orderBy: { id: "asc" },
  });

  payload.meta = {
    exportedAt: new Date().toISOString(),
    bookCount: books.length,
    embeddingDim: books[0] ? parseEmbedding(books[0].embedding).length : null,
  };

  payload.books = books.map((b) => ({
    id: b.id,
    name: b.name,
    status: b.status,
    embedding: parseEmbedding(b.embedding),
  }));

  const json = JSON.stringify(payload, null, 2);

  if (out) {
    const abs = path.isAbsolute(out) ? out : path.join(process.cwd(), out);
    fs.writeFileSync(abs, json, "utf8");
    console.error(
      `Wrote ${abs} (${payload.books.length} books, ${payload.userSnapshots.length} snapshots)`
    );
  } else {
    process.stdout.write(json);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
