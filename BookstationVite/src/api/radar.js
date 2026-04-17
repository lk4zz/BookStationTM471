import { privateApi } from "./axios";

export const getUserRadar = async (userId) => {
  const res = await privateApi.get(`/radar/${userId}`);
  return res.data;
};
