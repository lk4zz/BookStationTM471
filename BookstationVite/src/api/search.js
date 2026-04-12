import { privateApi } from "./axios";

export const getSearch = async (searchQuery) => {
  const res = await privateApi.get(`/search?q=${searchQuery}`);
  return res.data;
};