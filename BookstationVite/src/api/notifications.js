import { privateApi } from "./axios";

export const getNotifications = async () => {
  const res = await privateApi.get("/notifications");
  return res.data;
};

export const markNotificationAsRead = async (id) => {
  const res = await privateApi.patch(`/notifications/${id}/read`);
  return res.data;
};