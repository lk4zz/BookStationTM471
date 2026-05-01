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

export const getPendingApplications = async () => {
  const res = await privateApi.get("/applications/pending");
  return res.data;
};

export const reviewApplication = async ({ applicationId, status }) => {
  const res = await privateApi.put(`/applications/${applicationId}/review`, { status });
  return res.data;
};

export const changeUserRole = async ({ userId, roleId }) => {
  const res = await privateApi.put(`/admin/users`, { userId, roleId });
  return res.data;
};