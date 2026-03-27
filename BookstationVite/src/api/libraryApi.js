import { privateApi } from "./axios";

export const fetchLibraryBooks = async () => {
  const response = await privateApi.get("/library/books");
  return response.data.data;
};

export const removeBook = async (bookId) => {
  const response = await privateApi.delete(`/library/books/${bookId}`);
  return response.data;
};

export const addBook = async (bookId) => {
  const response = await privateApi.post(`/library/books/${bookId}`);
  return response.data;
};