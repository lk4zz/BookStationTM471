import { privateApi } from "./axios";

export const addRating = async (bookId, rating) => {
    console.log("Adding rating", rating);
  const res = await privateApi.post(`/rate/${bookId}`, { rating });
  return res.data;
};

export const getRatings = async (bookId) => {
  const res = await privateApi.get(`/rate/${bookId}`);
  return res.data;
};