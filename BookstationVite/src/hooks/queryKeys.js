

// This file is full of query keys used to refresh and invalidate queries 
// whenever a mutation occurs these keys are used to refresh
//  the query hooks to refetch fresh data

export const qk = {
  user: {
    current: () => ["currentUserId"],
    detail: (userId) => ["user", Number(userId)],
    list: () => ["users"],
    radar: (userId) => ["radar", Number(userId)],
  },

  books: {
    all: () => ["books"],
    detail: (id, includeAuth = false) => ["book", Number(id), Boolean(includeAuth)],
    forYou: () => ["books", "for-you"],
    byGenre: (genreId) => ["books", "genre", Number(genreId)],
    byAuthor: (authorId) => ["books", "author", Number(authorId)],
    trending: (limit) => ["books", "trending", Number(limit)],
    highEngagement: (limit) => ["books", "high-engagement", Number(limit)],
    followedAuthors: () => ["books", "followed-authors"],
    discover: (limit) => ["books", "discover", Number(limit)],
    completed: (limit) => ["books", "completed", Number(limit)],
  },

  chapters: {
    all: () => ["chapters"],
    byBook: (bookId) => ["chapters", Number(bookId)],
    detail: (chapterId) => ["chapter", Number(chapterId)],
  },

  pages: {
    reader: (chapterId) => ["pages", Number(chapterId)],
    author: (chapterId) => ["pages", "author", Number(chapterId)],
  },

  comments: {
    byBook: (bookId) => ["comments", Number(bookId)],
  },

  ratings: {
    byBook: (bookId) => ["ratings", Number(bookId)],
    batch: (bookIds) => ["ratings", "batch", [...new Set((bookIds ?? []).map(Number))].sort((a, b) => a - b)],
  },

  progress: {
    byBook: (bookId) => ["progress", Number(bookId)],
  },

  wallet: {
    all: () => ["wallet"],
  },

  notifications: {
    all: () => ["notifications"],
  },

  reports: {
    byBook: (bookId) => ["bookReports", Number(bookId)],
  },

  follow: {
    status: (authorId) => ["followStatus", Number(authorId)],
  },

  search: {
    query: (query) => ["search", query],
  },

  genres: {
    all: () => ["genres"],
  },

  application: {
    status: () => ["applicationStatus"],
  },

  admin: {
    users: () => ["admin", "users"],
    books: () => ["admin", "books"],
    applications: () => ["admin", "applications"],
    reviewQueue: () => ["admin", "reviewQueue"],
  },

  library: {
    all: () => ["library"],
  },
};
