import { publicApi, privateApi } from "./axios";

export const getViews = async (id) => {
  const res = await publicApi.get(`/views/${id}`);

  return res.data;
};

export const addView = async (id) => {
  const res = await privateApi.post(`/views/${id}`);
  console.log(res.data)
};

export default { getViews, addView };
