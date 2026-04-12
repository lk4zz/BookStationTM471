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
    userId,
  } = book;

  const resolvedCoverUrl = !coverImage
    ? "/fallback-cover.jpg"
    : coverImage.startsWith("http")
      ? coverImage
      : `${BASE_URL}/${coverImage}`;

  return {
    name,
    description,
    coverUrl: resolvedCoverUrl,
    ratingAverage,
    ratingCount,
    authorName: author?.name || "Unknown",
    bookId : id,
    userId,
  };

};
