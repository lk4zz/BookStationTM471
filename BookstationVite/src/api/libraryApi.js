import { privateApi } from "./axios";

// Fetches all books in the user's library
export const fetchLibraryBooks = async () => {
  const response = await privateApi.get("/library/books");
  // Backend returns: { success: true, count: X, data: [...] }
  return response.data.data;
};

// Removes a book from the user's library
export const removeBook = async (bookId) => {
  const response = await privateApi.delete(`library/books/${bookId}`);
  return response.data;
};

// Adds a book to the user's library
export const addBook = async (bookId) => {
  const response = await privateApi.post(`library/books/${bookId}`);
  return response.data;
};