const BASE_URL = import.meta.env.VITE_API_URL || "";

export const formatBookData = (book) => {
  if (!book) return null;

  const {
    name = "Untitled",
    description = "",
    coverImage = "",
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
    authorName: author?.name || "Unknown",
    bookId: id,
    userId,
  };

};
