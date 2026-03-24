import { publicApi, privateApi } from "./axios";

export const getViews = async (id) => {
  const res = await publicApi.get(`/views/${id}`);

  return res.data;
};

export const addView = async (id) => {
  await publicApi.post(`/views/${id}`);
};

export default { getViews, addView };
