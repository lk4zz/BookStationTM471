const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

// ─── Static config ────────────────────────────────────────────────────────────

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

async function wipeAppData() {
  await prisma.$transaction(async (tx) => {
    await tx.pageChunk.deleteMany();
    await tx.readingProgress.deleteMany();
    await tx.libraryBook.deleteMany();
    await tx.comments.deleteMany();
    await tx.rating.deleteMany();
    await tx.bookViews.deleteMany();
    await tx.chapterUnlocks.deleteMany();
    await tx.pages.deleteMany();
    await tx.chapters.deleteMany();
    await tx.bookGenre.deleteMany();
    // Reports.book has no onDelete: Cascade — must clear before Books.
    await tx.reports.deleteMany();
    await tx.moderationLog.deleteMany();
    await tx.books.deleteMany();
    await tx.library.deleteMany();
    await tx.transactionLedger.deleteMany();
    await tx.followers.deleteMany();
    // No cascade from User on these relations — clear before User.
    await tx.notifications.deleteMany();
    await tx.authorApplication.deleteMany();
    await tx.user.deleteMany();
    await tx.userRole.deleteMany();
  }, 
  {
    timeout: 60000, // Increased timeout to 60 seconds
  });
}
async function ensureGenres() {
  for (const type of genreTypes) {
    const existing = await prisma.genre.findFirst({ where: { type } });
    if (!existing) await prisma.genre.create({ data: { type } });
  }
}

async function ensureRoles() {
  await prisma.userRole.upsert({
    where: { id: 1 },
    create: { id: 1, name: "USER" },
    update: { name: "USER" },
  });

  await prisma.userRole.upsert({
    where: { id: 2 },
    create: { id: 2, name: "AUTHOR" },
    update: { name: "AUTHOR" },
  });

  await prisma.userRole.upsert({
    where: { id: 3 },
    create: { id: 3, name: "ADMIN" },
    update: { name: "ADMIN" },
  });

  await prisma.userRole.upsert({
    where: { id: 4 },
    create: { id: 4, name: "SUPER_ADMIN" },
    update: { name: "SUPER_ADMIN" },
  });
}

async function seedUsers() {
  const userRole = await prisma.userRole.findUnique({ where: { id: 1 } });
  const authorRole = await prisma.userRole.findUnique({ where: { id: 2 } });
  const adminRole = await prisma.userRole.findUnique({ where: { id: 3 } });
  const superAdminRole = await prisma.userRole.findUnique({ where: { id: 4 } });

  if (!userRole || !authorRole || !adminRole || !superAdminRole) {
    throw new Error("USER, AUTHOR, ADMIN, and SUPER_ADMIN roles must exist before seeding users.");
  }

  // ==========================================
  // 1. SECURE SUPER ADMIN SEEDING (via .env)
  // ==========================================
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn("⚠️ Admin credentials missing in .env. Skipping Super Admin creation.");
  } else {
    const adminHash = await bcrypt.hash(adminPassword, 10);

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {}, 
      create: {
        name: "Super Admin",
        email: adminEmail,
        password: adminHash,
        coinBalance: 0, 
        roleId: superAdminRole.id,
      },
    });
    console.log(`✅ Super Admin created: ${adminEmail}`);
  }

  // ==========================================
  // 2. BLUEPRINT USERS SEEDING
  // ==========================================
  const passwordHash = await bcrypt.hash("password123", 10);
  const users = [];

  for (const bp of userBlueprints) {
    let roleId = userRole.id;
    
    if (bp.role === "AUTHOR") {
      roleId = authorRole.id;
    } else if (bp.role === "ADMIN") {
      roleId = adminRole.id;
    }

    const user = await prisma.user.upsert({
      where: { email: bp.email },
      update: {},
      create: {
        name: bp.name,
        email: bp.email,
        password: passwordHash,
        coinBalance: bp.coinBalance,
        roleId: roleId,
      },
    });
    users.push(user);
  }

  console.log(`✅ Seeded ${users.length} blueprint users.`);
  return users;
}

async function main() {
  console.log("Wiping application data…");
  await wipeAppData();

  console.log("Ensuring roles and genres…");
  await ensureRoles();
  await ensureGenres();

  console.log("Creating users…");
  await seedUsers();
  
  console.log("Done. Database ready for Gutenberg import.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });