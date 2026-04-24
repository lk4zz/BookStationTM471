import { privateApi } from "./axios";

export const getUserRadar = async (userId) => {
  const res = await privateApi.get(`/admin/radar/${userId}`);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await privateApi.get("/admin/users"); 
  return res.data;
};

export const banUser = async (userId) => {
  const res = await privateApi.delete(`/admin/users/${userId}`);
  return res.data;
};

export const deleteBook = async (bookId) => {
  const res = await privateApi.delete(`/admin/books/${bookId}`);
  return res.data;
};