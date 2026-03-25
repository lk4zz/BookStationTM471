const BASE_URL = import.meta.env.VITE_API_URL || "";

export const formatBookData = (book) => {
  if (!book) return null;

  const {
    name = "Untitled",
    description = "",
    coverImage = "",
    ratingAverage = 0,
    ratingCount = 0,
    author,
    id,
  } = book;

  return {
    name,
    description,
    coverUrl: coverImage ? `${BASE_URL}/${coverImage}` : "/fallback-cover.jpg",
    ratingAverage,
    ratingCount,
    authorName: author?.name || "Unknown",
    bookId : id,
  };

};
