import { privateApi } from "./axios";

export const updateReadingProgress = async ({ bookId, chapterId }) => {
    console.log(`/progress/${bookId}/${chapterId}`)
  const res = await privateApi.post(`/progress/${bookId}/${chapterId}`);
  return res.data;
};

export const getReadingProgress = async (bookId) => {
  const res = await privateApi.get(`/progress/book/${bookId}`);
  return res.data;
};