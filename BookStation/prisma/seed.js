const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const genreTypes = [
  "Fantasy",
  "Sci-Fi",
  "Mystery",
  "Romance",
  "Thriller",
  "Historical",
];

const userBlueprints = [
  { name: "Sara Quinn", email: "sara.writer@bookstation.dev", role: "USER", coinBalance: 500 },
  { name: "Leo Hart", email: "leo.writer@bookstation.dev", role: "USER", coinBalance: 500 },
  { name: "Mina Vale", email: "mina.reader@bookstation.dev", role: "USER", coinBalance: 2500 },
  { name: "Omar Finch", email: "omar.reader@bookstation.dev", role: "USER", coinBalance: 2500 },
  { name: "Admin One", email: "admin@bookstation.dev", role: "ADMIN", coinBalance: 10000 },
];

const getSeedCoverUrl = (index) =>
  `https://picsum.photos/seed/bookstation-cover-${index + 1}/600/900`;

const titleHeads = [
  "Moonfire",
  "Glass",
  "Iron",
  "Silent",
  "Golden",
  "Winter",
  "Shadow",
  "Echo",
  "Scarlet",
  "Storm",
];

const titleTails = [
  "Archive",
  "Harbor",
  "Signal",
  "Letters",
  "Crown",
  "Bridge",
  "Voyage",
  "Riddle",
  "Code",
  "Oath",
];

const chapterNamePool = [
  "First Light",
  "Broken Compass",
  "Cold Wind",
  "Hidden Room",
  "False Trail",
  "Last Witness",
  "Silent Engine",
  "Burning Map",
  "Night Window",
  "Open Sea",
];

const bookBlueprints = [];
for (let i = 0; i < 40; i += 1) {
  const isDraft = i % 5 === 0;
  const isCompleted = i % 7 === 0 && !isDraft;
  const status = isDraft ? "DRAFT" : isCompleted ? "COMPLETED" : "ONGOING";
  const authorEmail = i % 2 === 0 ? "sara.writer@bookstation.dev" : "leo.writer@bookstation.dev";
  const head = titleHeads[i % titleHeads.length];
  const tail = titleTails[(i * 3) % titleTails.length];
  const chapterCount = isDraft ? 2 : 3 + (i % 3);

  const chapters = Array.from({ length: chapterCount }, (_, idx) => {
    const isPublished = status === "DRAFT" ? false : idx < chapterCount - 1 || status === "COMPLETED";
    const isPaid = idx > 0 && isPublished && idx % 2 === 0;
    return {
      title: `${chapterNamePool[(i + idx) % chapterNamePool.length]} ${idx + 1}`,
      isPublished,
      price: isPaid ? 10 + ((idx + i) % 3) * 5 : 0,
      pageCount: 2 + ((i + idx) % 2),
    };
  });

  bookBlueprints.push({
    authorEmail,
    name: `${head} ${tail} ${i + 1}`,
    description: `Book ${i + 1}: A layered story with evolving conflicts, character growth, and long-form scenes suited for testing reading and writing flows.`,
    coverImage: getSeedCoverUrl(i),
    status,
    views: status === "DRAFT" ? 0 : 30 + (i % 12) * 9,
    genres: [genreTypes[i % genreTypes.length], genreTypes[(i + 2) % genreTypes.length]],
    chapters,
  });
}

const commentBlueprints = [
  {
    userEmail: "mina.reader@bookstation.dev",
    bookName: "Moonfire Archive 1",
    comment: "The worldbuilding is amazing. Chapter two was intense.",
  },
  {
    userEmail: "omar.reader@bookstation.dev",
    bookName: "Glass Letters 2",
    comment: "Great pacing and cool plot twists so far.",
  },
];

const makePageText = (bookName, chapterTitle, pageNumber) => {
  const paragraphA = `${bookName} continues with a slower, detailed narrative beat where the main character reflects on earlier choices, studies the environment, and discovers subtle clues that connect to the broader conflict. The tone stays literary enough for reading tests while still keeping clear action beats for dashboard previews and excerpts.`;
  const paragraphB = `In ${chapterTitle}, page ${pageNumber} adds progression: a conversation reveals competing motives, then a practical obstacle forces a decision under pressure. This seeded content is intentionally verbose so that page one has enough body text to exercise chapter pricing rules, pagination visuals, and long-form editor rendering behavior.`;
  const paragraphC = `By the end of this page, the stakes rise and a concrete objective is set for the next scene. Supporting details remain coherent across chapters but generic enough for dummy data usage. This paragraph exists to increase page density for realistic testing and avoid sparse-content edge cases in components that rely on richer text.`;
  return `<h2>${chapterTitle}</h2><p>${paragraphA}</p><p>${paragraphB}</p><p>${paragraphC}</p>`;
};

const countWords = (text) => {
  const plain = text.replace(/<[^>]*>/g, " ").trim();
  if (!plain) return 0;
  return plain.split(/\s+/).length;
};

async function resetData() {
  await prisma.pageChunk.deleteMany();
  await prisma.readingProgress.deleteMany();
  await prisma.chapterUnlocks.deleteMany();
  await prisma.pages.deleteMany();
  await prisma.chapters.deleteMany();
  await prisma.comments.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.bookViews.deleteMany();
  await prisma.bookGenre.deleteMany();
  await prisma.libraryBook.deleteMany();
  await prisma.library.deleteMany();
  await prisma.followers.deleteMany();
  await prisma.transactionLedger.deleteMany();
  await prisma.books.deleteMany();
  await prisma.user.deleteMany();
  await prisma.genre.deleteMany();
}

async function seedRoles() {
  await prisma.$executeRawUnsafe(
    "UPDATE user_role SET createdAt = NOW() WHERE createdAt = '0000-00-00 00:00:00'",
  );
  await prisma.$executeRawUnsafe(
    "UPDATE user_role SET updatedAt = NOW() WHERE updatedAt = '0000-00-00 00:00:00'",
  );

  await prisma.userRole.createMany({
    data: [{ name: "USER" }, { name: "ADMIN" }],
    skipDuplicates: true,
  });

  const userRole = await prisma.userRole.findUnique({
    where: { name: "USER" },
    select: { id: true, name: true },
  });
  const adminRole = await prisma.userRole.findUnique({
    where: { name: "ADMIN" },
    select: { id: true, name: true },
  });

  if (!userRole || !adminRole) {
    throw new Error("Required roles were not found after role seeding.");
  }

  return { userRole, adminRole };
}

async function seedUsers(roleMap) {
  const hashedPassword = await bcrypt.hash("Password123!", 10);
  const usersByEmail = {};

  for (const entry of userBlueprints) {
    const created = await prisma.user.create({
      data: {
        name: entry.name,
        email: entry.email,
        password: hashedPassword,
        roleId: roleMap[entry.role].id,
        coinBalance: entry.coinBalance,
      },
    });
    usersByEmail[entry.email] = created;
  }

  return usersByEmail;
}

async function seedGenres() {
  const genresByType = {};
  for (const type of genreTypes) {
    const created = await prisma.genre.create({ data: { type } });
    genresByType[type] = created;
  }
  return genresByType;
}

async function seedBooksAndContent(usersByEmail, genresByType) {
  const booksByName = {};

  for (const blueprint of bookBlueprints) {
    const author = usersByEmail[blueprint.authorEmail];
    const book = await prisma.books.create({
      data: {
        userId: author.id,
        name: blueprint.name,
        description: blueprint.description,
        coverImage: blueprint.coverImage,
        status: blueprint.status,
      },
    });

    booksByName[book.name] = book;

    await prisma.bookViews.createMany({
      data: Array.from({ length: blueprint.views }, (_, index) => ({
        userId: index % 2 === 0 ? usersByEmail["mina.reader@bookstation.dev"].id : usersByEmail["omar.reader@bookstation.dev"].id,
        bookId: book.id,
      })),
    });

    for (const genreType of blueprint.genres) {
      await prisma.bookGenre.create({
        data: {
          bookId: book.id,
          genreId: genresByType[genreType].id,
        },
      });
    }

    for (let i = 0; i < blueprint.chapters.length; i += 1) {
      const chapterBlueprint = blueprint.chapters[i];

      const pages = Array.from({ length: chapterBlueprint.pageCount }, (_, pageIndex) => ({
        pageNum: pageIndex + 1,
        text: makePageText(book.name, chapterBlueprint.title, pageIndex + 1),
      }));

      const wordCount = pages.reduce((sum, page) => sum + countWords(page.text), 0);

      await prisma.chapters.create({
        data: {
          bookId: book.id,
          chapterNum: i + 1,
          title: chapterBlueprint.title,
          isPublished: chapterBlueprint.isPublished,
          price: chapterBlueprint.price,
          isLocked: chapterBlueprint.price > 0,
          wordCount,
          pages: {
            create: pages,
          },
        },
      });
    }
  }

  return booksByName;
}

async function seedSocialData(usersByEmail, booksByName) {
  await prisma.followers.createMany({
    data: [
      {
        followerId: usersByEmail["mina.reader@bookstation.dev"].id,
        followingId: usersByEmail["sara.writer@bookstation.dev"].id,
      },
      {
        followerId: usersByEmail["omar.reader@bookstation.dev"].id,
        followingId: usersByEmail["leo.writer@bookstation.dev"].id,
      },
    ],
  });

  await prisma.library.createMany({
    data: [
      { userId: usersByEmail["mina.reader@bookstation.dev"].id },
      { userId: usersByEmail["omar.reader@bookstation.dev"].id },
    ],
  });

  const minaLibrary = await prisma.library.findUnique({
    where: { userId: usersByEmail["mina.reader@bookstation.dev"].id },
  });
  const omarLibrary = await prisma.library.findUnique({
    where: { userId: usersByEmail["omar.reader@bookstation.dev"].id },
  });

  await prisma.libraryBook.createMany({
    data: [
      { libraryId: minaLibrary.id, bookId: booksByName["Moonfire Archive 1"].id },
      { libraryId: minaLibrary.id, bookId: booksByName["Glass Letters 2"].id },
      { libraryId: omarLibrary.id, bookId: booksByName["Iron Voyage 3"].id },
    ],
  });

  for (const entry of commentBlueprints) {
    await prisma.comments.create({
      data: {
        userId: usersByEmail[entry.userEmail].id,
        bookId: booksByName[entry.bookName].id,
        comment: entry.comment,
      },
    });
  }
}

async function main() {
  await resetData();
  const roles = await seedRoles();
  const usersByEmail = await seedUsers({
    USER: roles.userRole,
    ADMIN: roles.adminRole,
  });
  const genresByType = await seedGenres();
  const booksByName = await seedBooksAndContent(usersByEmail, genresByType);
  await seedSocialData(usersByEmail, booksByName);

  console.log("Seed complete.");
  console.log("Users:", await prisma.user.count());
  console.log("Books:", await prisma.books.count());
  console.log("Chapters:", await prisma.chapters.count());
  console.log("Pages:", await prisma.pages.count());
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });