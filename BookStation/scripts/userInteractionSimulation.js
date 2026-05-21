const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { addToLibraryTasteBlender } = require("../utils/AlgorithmTasteBlenders/LibraryBookTasteBlender");

const prisma = new PrismaClient();

const firstNames = [
  "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
  "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph",
  "Jessica", "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy",
  "Matthew", "Lisa", "Daniel", "Betty", "Mark", "Margaret", "Donald", "Sandra",
  "Steven", "Ashley", "Paul", "Kimberly", "Andrew", "Emily", "Joshua", "Donna",
  "Kenneth", "Michelle", "Kevin", "Dorothy", "Brian", "Carol", "George", "Amanda",
  "Edward", "Melissa", "Ronald", "Deborah"
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
  "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
  "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
  "Carter", "Roberts"
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function run() {
  console.log("Starting user interaction simulation...");

  // 1. Clean up old simulation users
  console.log("Cleaning up existing simulation users...");
  const deleteResult = await prisma.user.deleteMany({
    where: {
      email: {
        startsWith: "sim_user_"
      }
    }
  });
  console.log(`Deleted ${deleteResult.count} old simulation users.`);

  // 2. Fetch all books from DB
  const books = await prisma.books.findMany({
    include: {
      bookGenres: true,
      chapters: {
        orderBy: { chapterNum: "asc" }
      }
    }
  });

  if (books.length === 0) {
    console.error("No books found in the database. Please ingest some books first.");
    return;
  }
  console.log(`Found ${books.length} books in the database.`);

  // 3. Ensure every book has an embedding vector (inject a mock one if missing, to support taste blending)
  console.log("Ensuring all books have embeddings (injecting mock vectors where missing)...");
  let mockEmbeddingsCount = 0;
  for (const book of books) {
    if (!book.embedding) {
      const mockVector = Array.from({ length: 384 }, () => (Math.random() - 0.5) * 0.1);
      await prisma.books.update({
        where: { id: book.id },
        data: { embedding: JSON.stringify(mockVector) }
      });
      book.embedding = JSON.stringify(mockVector); // Update local reference
      mockEmbeddingsCount++;
    }
  }
  console.log(`Injected mock embeddings for ${mockEmbeddingsCount} books.`);

  // 4. Pre-hash password for performance
  console.log("Hashing password for simulation users...");
  const passwordHash = await bcrypt.hash("password123", 10);

  // 5. Create 100 fake users
  const users = [];
  const totalUsers = 100;
  console.log(`Creating ${totalUsers} simulation users...`);
  
  for (let i = 1; i <= totalUsers; i++) {
    const name = `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`;
    const email = `sim_user_${i}@bookstation.dev`;
    
    // Distribute preferred genre IDs evenly 1-6
    const preferredGenreId = (i % 6) + 1;
    
    // Create user and library in one transaction
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        roleId: 1, // USER role
        bio: `A simulated reader who loves books in genre #${preferredGenreId}.`,
        libraries: {
          create: {}
        }
      },
      include: {
        libraries: true
      }
    });

    users.push({
      ...user,
      preferredGenreId
    });
  }
  console.log(`Successfully created ${users.length} simulation users.`);

  // 6. Generate interactions
  let viewsCreated = 0;
  let ratingsCreated = 0;
  let libraryBooksCreated = 0;
  let progressCreated = 0;

  console.log("Generating 1000+ user interactions...");

  for (const user of users) {
    const library = user.libraries[0];
    if (!library) continue;

    // Separate books into preferred genre vs other
    const preferredBooks = books.filter(b => 
      b.bookGenres.some(bg => bg.genreId === user.preferredGenreId)
    );
    const otherBooks = books.filter(b => 
      !b.bookGenres.some(bg => bg.genreId === user.preferredGenreId)
    );

    // Helper to select book based on 80% preference bias
    function selectBook() {
      if (preferredBooks.length > 0 && Math.random() < 0.8) {
        return getRandomElement(preferredBooks);
      }
      return getRandomElement(otherBooks) || getRandomElement(books);
    }

    // A. Create views (reading sessions)
    const numViews = Math.floor(Math.random() * 5) + 5; // 5 to 9 views
    const viewedBookIds = new Set();
    for (let v = 0; v < numViews; v++) {
      const book = selectBook();
      if (!book) continue;
      viewedBookIds.add(book.id);
    }

    for (const bookId of viewedBookIds) {
      await prisma.bookViews.create({
        data: {
          userId: user.id,
          bookId
        }
      });
      viewsCreated++;
    }

    // B. Create ratings
    const numRatings = Math.floor(Math.random() * 3) + 3; // 3 to 5 ratings
    const ratedBookIds = new Set();
    for (let r = 0; r < numRatings; r++) {
      const book = selectBook();
      if (!book) continue;
      ratedBookIds.add(book.id);
    }

    for (const bookId of ratedBookIds) {
      // Determine rating value based on preference bias
      const isPreferred = preferredBooks.some(b => b.id === bookId);
      const ratingValue = isPreferred
        ? getRandomElement([4.0, 4.5, 5.0])
        : getRandomElement([2.0, 2.5, 3.0, 3.5, 4.0]);

      await prisma.rating.create({
        data: {
          userId: user.id,
          bookId,
          value: ratingValue
        }
      });
      ratingsCreated++;
    }

    // C. Create library entries (favorites)
    const numLib = Math.floor(Math.random() * 2) + 2; // 2 to 3 favorites
    const libBookIds = new Set();
    for (let l = 0; l < numLib; l++) {
      const book = selectBook();
      if (!book) continue;
      libBookIds.add(book.id);
    }

    for (const bookId of libBookIds) {
      await prisma.libraryBook.create({
        data: {
          libraryId: library.id,
          bookId
        }
      });
      libraryBooksCreated++;
      
      // Blend user taste profile with book embedding!
      await addToLibraryTasteBlender(user.id, bookId);
    }

    // D. Create reading progress
    const progressBookIds = [...libBookIds].slice(0, 2); // 1 or 2 progress rows from library books
    for (const bookId of progressBookIds) {
      const bookObj = books.find(b => b.id === bookId);
      if (bookObj && bookObj.chapters && bookObj.chapters.length > 0) {
        const randomChapter = getRandomElement(bookObj.chapters);
        await prisma.readingProgress.create({
          data: {
            userId: user.id,
            bookId,
            lastChapterId: randomChapter.id
          }
        });
        progressCreated++;
      }
    }
  }

  const totalInteractions = viewsCreated + ratingsCreated + libraryBooksCreated + progressCreated;
  console.log(`\nSimulation Complete!`);
  console.log(`------------------------------`);
  console.log(`Users Created:      ${users.length}`);
  console.log(`Views Created:      ${viewsCreated}`);
  console.log(`Ratings Created:    ${ratingsCreated}`);
  console.log(`Library Additions:  ${libraryBooksCreated}`);
  console.log(`Progress Markers:   ${progressCreated}`);
  console.log(`Total Interactions: ${totalInteractions}`);
  console.log(`------------------------------`);
}

run()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
