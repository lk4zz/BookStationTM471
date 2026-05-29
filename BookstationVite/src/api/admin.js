import { privateApi } from "./axios";

//front end api fetching from backend
export const getUserRadar = async (userId) => {
  const res = await privateApi.get(`/admin/radar/${userId}`);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await privateApi.get("/admin/users"); 
  return res.data;
};

export const getAdminBooks = async () => {
  const res = await privateApi.get("/admin/books");
  return res.data;
};

/** Toggle soft-ban (suspend / reinstate) */
export const toggleUserBan = async (userId) => {
  const res = await privateApi.put(`/admin/users/${userId}`);
  return res.data;
};

/** @deprecated use toggleUserBan */
export const banUser = toggleUserBan;

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

export const getReviewQueue = async () => {
  const res = await privateApi.get("/admin/books/review-queue");
  return res.data;
};

export const flagBookAndNotify = async ({ bookId, message }) => {
  const res = await privateApi.put(`/admin/books/${bookId}/flag`, { message });
  return res.data;
};

export const unflagBook = async ({ bookId, message }) => {
  const res = await privateApi.put(`/admin/books/${bookId}/unflag`, { message });
  return res.data;
};

export const sendFeedbackAgain = async ({ bookId, message }) => {
  const res = await privateApi.put(`/admin/books/${bookId}/send-feedback`, { message });
  return res.data;
};